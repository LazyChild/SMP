/**
 * Networking Course Project, TCP application for students management.
 * The request and response model.
 *
 * @author Renyu Liu & Yifan Li
 */
"use strict";

// Protocol Version
var VERSION = "SMP/1.0";

/**
 * This class represents the SMP Request.
 *
 * @param method the SMP method
 * @param studentId the student identifier
 * @param entity the student JSON (if any)
 * @constructor
 */
var SMPRequest = function (method, studentId, entity) {
    this.method = method;
    this.id = studentId;
    this.entity = entity;
    this.createTime = new Date();

    this.send = function () {
        var lines = [];
        lines.push(this.method + " " + this.id + " " + VERSION);
        lines.push("Time: " + this.createTime);
        lines.push("User-Agent: " + SMPRequest.USER_AGENT);
        lines.push("Authorization: " + SMPRequest.AUTHORIZATION);
        if (this.entity) {
            lines.push("\n" + this.entity);
        }
        SMPRequest.client.write(lines.join("\n"));
    };

    this.parse = function (content) {
        var lines = content.split("\n");
        var requestLineItems = lines[0].split(" ");
        this.method = requestLineItems[0];
        this.id = requestLineItems[1];

        var count = 1;
        while (count < lines.length) {
            var line = lines[count];
            if (line.length === 0) {
                // end of header
                break;
            }
            var keyValue = line.split(": ");
            if (keyValue[0] === "Time") {
                this.createTime = Date.parse(keyValue[1]);
            }

            ++count;
        }

        if (count < lines.length) {
            // has body
            this.entity = "";
            while (count < lines.length) {
                this.entity += lines[count] + "\n";
                ++count;
            }
        }
    };
};

exports.SMPRequest = SMPRequest;
