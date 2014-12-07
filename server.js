/**
 * Networking Course Project, TCP application for students management.
 * Server side.
 *
 * @author Renyu Liu & Yifan Li
 */
"use strict";

var net = require("net");
var prompt = require("prompt");
var SMPRequest = require("./model").SMPRequest;

// Data structures hold the students
var students = {};

// Server information
var SERVER = "MAC OSX NodeJS Server Version 1.0";
var AUTHORIZATION = "9wDjnHvsFYU4MK";
var PORT = 6969;

var server = net.createServer(function (socket) {

    console.log(("Client connected: " + socket.remoteAddress + ": " + socket.remotePort).red);
    socket.setEncoding("utf-8");

    // Process the whole message
    socket.on("data", function (data) {
        console.log("IN: " + data);

        var request = new SMPRequest();
        request.parse(data);
        console.log("method: " + request.method + " id: " + request.id);

        switch (request.method) {
            case "POST":
                students[request.id] = JSON.parse(request.entity);
                break;
            case "GET":
                break;
            case "PUT":
                if (!students.hasOwnProperty(request.id)) {
                    students[request.id] = JSON.parse(request.entity);
                } else {

                }
                break;
            case "DELETE":
                if (students.hasOwnProperty(request.id)) {
                    delete students[request.id];
                } else {

                }
                break;
            default:
        }

        socket.write("Received!");
    });

    socket.on('close', function () {
       console.log("Client has left.".red);
    });
});

server.listen(PORT, function () {
    console.log("Server is listening on " + server.address().port);
});
