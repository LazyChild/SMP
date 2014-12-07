/**
 * Networking Course Project, TCP application for students management.
 * Client side.
 *
 * @author Renyu Liu & Yifan Li
 */
"use strict";

var net = require("net");
var prompt = require("prompt");
var SMPRequest = require("./model").SMPRequest;

var PORT = 6969;

var client = net.connect(PORT);
client.setEncoding("utf-8");

// Client Information
SMPRequest.USER_AGENT = "MAC OSX NodeJS Client Version 1.0";
SMPRequest.AUTHORIZATION = "9wDjnHvsFYU4MK";
SMPRequest.client = client;

client.on("connect", function () {
    console.log("Connected to: " + PORT);
    getRequest();
});

client.on("data", function (data) {

    var statusCode = 200;
    console.log(("FROM server: response status code: " + statusCode).magenta);
});


var getStudentProfileDetail = function (callback) {
    prompt.get({
        properties: {
            studentId: {
                description: "Student ID"
            },
            name: {
                description: "Name"
            },
            gender: {
                description: "Gender"
            },
            major: {
                description: "Major"
            },
            picture: {
                description: "Picture"
            }
        }
    }, function (err, result) {
        callback(result);
    });
};

var getStudentId = function (callback) {

    prompt.get({
        properties: {
            studentId: {
                description: "Student ID"
            }
        }
    }, function (err, result) {
        callback(result.studentId);
    });
};

/**
 * Create student.
 */
var handleCreate = function (callback) {
    console.log("Please fill information for new student!".cyan);
    getStudentProfileDetail(function (student) {
        var content = JSON.stringify(student);
        var request = new SMPRequest("POST", student.studentId, content);
        request.send();
        callback("OK");
    });
};

/**
 * Retrieve student.
 */
var handleRetrieve = function (callback) {
    console.log("Please specify which student profile you are willing to retrieve!".cyan);
    getStudentId(function (studentId) {
        var request = new SMPRequest("GET", studentId);
        request.send();
        callback("OK");
    });
};

/**
 * Update student.
 */
var handleUpdate = function (callback) {
    console.log("Please fill new information for the student!".cyan);
    getStudentProfileDetail(function (student) {
        var content = JSON.stringify(student);
        var request = new SMPRequest("PUT", student.studentId, content);
        request.send();
        callback("OK");
    });
};

/**
 * Delete student.
 */
var handleDelete = function (callback) {
    console.log("Please specify which student profile you are willing to delete!".cyan);
    getStudentId(function (studentId) {
        var request = new SMPRequest("DELETE", studentId);
        request.send();
        callback("OK");
    });
};

prompt.message = "";
prompt.delimiter = "|".black;
prompt.start();

var
    info  = "\n\nPlease input your command:\n";
    info += "\t1) Create Student\n";
    info += "\t2) Retrieve Student\n";
    info += "\t3) Update Student\n";
    info += "\t4) Delete Student\n";

var getRequest = function () {
    console.log(info.green);
    prompt.get({
        properties: {
            type: {
                description: " "
            }
        }
    }, function (err, result) {
        var cb = function (result) {
            console.log(result.yellow);
            // Keep process following requests.
            getRequest();
        };

        switch (result.type) {
            case "1":
                handleCreate(cb);
                break;
            case "2":
                handleRetrieve(cb);
                break;
            case "3":
                handleUpdate(cb);
                break;
            case "4":
                handleDelete(cb);
                break;
            default:
                cb("Unrecognized command!");
        }
    });
};
