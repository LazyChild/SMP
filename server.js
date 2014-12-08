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
var SMPResponse = require("./model").SMPResponse;

// Data structures hold the students
var students = {};

// Server information
SMPResponse.SERVER = "MAC OSX NodeJS Server Version 1.0";
var AUTHORIZATION = "9wDjnHvsFYU4MK";
var PORT = 6969;

var server = net.createServer(function (socket) {

    console.log(("Client connected: " + socket.remoteAddress + ": " + socket.remotePort).red);
    socket.setEncoding("utf-8");
    SMPResponse.server = socket;

    // Process the whole message
    socket.on("data", function (data) {
        console.log("IN: " + data);

        var request = new SMPRequest();
        request.parse(data);
        console.log("method: " + request.method + " id: " + request.id + " @" + request.createTime);

        var response;
        try {
            if (request.authorization !== AUTHORIZATION) {
                response = new SMPResponse(401);
                return;
            }

            switch (request.method) {
                case "POST":
                    if (students.hasOwnProperty(request.id)) {
                        response = new SMPResponse(400);
                    } else {
                        students[request.id] = JSON.parse(request.entity);
                        response = new SMPResponse(201);
                    }
                    break;
                case "GET":
                    if (students.hasOwnProperty(request.id)) {
                        var student = students[request.id];
                        response = new SMPResponse(200, JSON.stringify(student));
                    } else {
                        response = new SMPResponse(404);
                    }
                    break;
                case "PUT":
                    if (students.hasOwnProperty(request.id)) {
                        students[request.id] = JSON.parse(request.entity);
                        response = new SMPResponse(200);
                    } else {
                        response = new SMPResponse(404);
                    }
                    break;
                case "DELETE":
                    if (students.hasOwnProperty(request.id)) {
                        delete students[request.id];
                        response = new SMPResponse(200);
                    } else {
                        response = new SMPResponse(404);
                    }
                    break;
                default:
                    response = new SMPResponse(501);
            }
        } finally {
            response.send();
        }
    });

    socket.on('close', function () {
       console.log("Client has left.".red);
    });
});


server.listen(PORT, function () {
    console.log("Server is listening on " + server.address().port);
});
