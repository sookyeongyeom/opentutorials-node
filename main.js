var http = require('http');
var fs = require('fs');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');
var template = require('./lib/template.js');

var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var fileList = fs.readdirSync('./data', (e, list) => {
        return list;
    });
    var list = template.list(fileList);

    if (pathname === '/') {
        fs.readFile(`data/${queryData.id}`, 'utf8', (e, description) => {
            if (queryData.id === undefined) {
                var title = 'Welcome';
                var description = 'Hello, Node.js!';
                var html = template.html(
                    title,
                    list,
                    `<h2>${title}</h2>${description}`,
                    `<a href="/create">Create</a>`
                );
            } else {
                var title = queryData.id;
                var html = template.html(
                    title,
                    list,
                    `<h2>${title}</h2>${description}`,
                    `
                    <a href="/create">Create</a>
                    <a href="/update?id=${title}">Update</a>
                    <form action="/delete_process" method="post">
                        <input type="hidden" name="id" value="${title}">
                        <input type="submit" value="Delete" />
                    </form>
                    `
                );
            }
            response.writeHead(200);
            response.end(html);
        });
    } else if (pathname === '/create') {
        fs.readFile(`data/${queryData.id}`, 'utf8', (e, description) => {
            var title = 'WEB - create';

            var html = template.html(
                title,
                list,
                `<form action="/create_process" method="post">
                <p>
                    <input type="text" name="title" placeholder="title" />
                </p>
                <p>
                    <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                    <input type="submit" />
                </p>
                </form>
                `,
                ''
            );
            response.writeHead(200);
            response.end(html);
        });
    } else if (pathname === '/create_process') {
        var body = '';
        request.on('data', (data) => {
            body += data;
        });
        request.on('end', () => {
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
            fs.writeFile(`data/${title}`, description, 'utf8', (e) => {
                response.writeHead(302, { Location: `/?id=${title}` });
                response.end('success');
            });
        });
    } else if (pathname === '/update') {
        fs.readFile(`data/${queryData.id}`, 'utf8', (e, description) => {
            var title = queryData.id;
            var html = template.html(
                title,
                list,
                `<form action="/update_process" method="post">
                <input type="hidden" name="id" value="${title}"/>
                <p>
                    <input type="text" name="title" placeholder="title" value="${title}" />
                </p>
                <p>
                    <textarea name="description" placeholder="description">${description}</textarea>
                </p>
                <p>
                    <input type="submit" />
                </p>
                </form>
                `,
                ''
            );
            response.writeHead(200);
            response.end(html);
        });
    } else if (pathname === '/update_process') {
        var body = '';
        request.on('data', (data) => {
            body += data;
        });
        request.on('end', () => {
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;
            fs.rename(`data/${id}`, `data/${title}`, (e) => {
                fs.writeFile(`data/${title}`, description, 'utf8', (e) => {
                    response.writeHead(302, { Location: `/?id=${title}` });
                    response.end('success');
                });
            });
        });
    } else if (pathname === '/delete_process') {
        var body = '';
        request.on('data', (data) => {
            body += data;
        });
        request.on('end', () => {
            var post = qs.parse(body);
            var id = post.id;
            fs.unlink(`data/${id}`, (e) => {
                response.writeHead(302, { Location: `/` });
                response.end('success');
            });
        });
    } else {
        response.writeHead(404);
        response.end('Not Found');
    }
});
app.listen(3000);
