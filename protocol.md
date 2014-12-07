# SMP - Networking Course Project
## 1. Introduction
This project is aimed to build a protocol for students management based on TCP. It refers the HTTP protocol as a blueprint.

We call it `Students Management Protocol (SMP)`.

### Authors
- Renyu Liu (刘仁宇 `11300240061`)
- Yifan Li (李一帆 `11300240084`)

## 2. Protocol Parameters
### SMP Version
SMP uses a "<major>.<minor>" numbering scheme to indicate versions of the protocol.
It is required to assure that the client side and server side would communicate successfully.

The version of an SMP message is indicated by an SMP-Version field in the first line of the message.

    SMP-Version     =   "SMP" "/" 1*DIGIT "." 1*DIGIT
    
### Student Identifier
To identify student, we use the student ID. It is assumed to be an unique integer which would fit in a `64-bit signed integer` type.

    Student-ID      =   DIGITS

### Encoding
For simplicity, `UTF-8` encoding is used for all messages.

### Date/Time Formats
The date/time format is the same as JavaScript standard. Such as:

    `Sat Dec 06 2014 15:47:25 GMT+0800 (CST)`

## 3. SMP Message
### Message Types
SMP message consist of requests from client to server and responses from server to client.

    SMP-message     =   Request   |   Response    ;
    
Both types of messages consist of a start-line, zero or more header fields an empty line indicating the end of the header fields, and possibly a message-body.

### Message Headers
Each header field consists of a name followed by a colon (":") and the field value. Field names are case-insensitive.

### Message Body
The message-body (if any) of an SMP message is used to carry the student entity-body (in sec.6) associated with the request or response.

## 4. Request
A request message from a client to a server includes, within the first line of that message, the method to be applied, and the protocol version in use.

    Request         =   Request-Line                ;
                        *(request-header CRLF)      ;
                        CRLF                        ;
                        [ message-body ]            ;
                      
### 4.1 Request-Line
The request line consist of the method to be applied and the protocol version.

    Request-Line    =   Method SP Student-ID SP SMP-Version CRLF
    
#### 4.1.1 Method
The method token indicates the method to be performed. It is case-sensitive.

    Method          =   "GET"
                    |   "POST"
                    |   "PUT"
                    |   "DELETE"

Not all methods are allowed on every students. If the method is not allowed on a specify student, the response status code would be `405` (Method Not Allowed).

If the method is unrecognized or not implemented by the server the response status code would be `501` (Not Implemented).

### 4.2 Request Header Fields
The request-header fields allow client to pass additional information about the request, and about client itself.

    request-header  =   "Authorization"
                    |   "User-Agent"
                    |   others

## 5. Response
After receiving and interpreting a request message, a server responds with an SMP response message.

    Response        =   Status-LINE                     ;
                        *(response-header CRLF)         ;
                        CRLF                            ;
                        [ message-body ]                ;
                        
### 5.1 Status-Line
The first line of a Response message is the Status-Line, consisting of the protocol version followed by a numeric status code and its associated textual phrase, with each element separated by SP characters.

    Status-Line     =   SMP-Version SP Status-Code SP Reason-Phrase CRLF

#### 5.1.1 Status Code and Reason Phrase
The status-code is a 3-digit integer result code of the attempt to understand an satisfy the request. The Reason-Phrase is intended to give a short textual description of the Status-Code.

The first digit of the Status-Code defines the class of response. The last two digits do not have any categorization role.

- `2xx`: Success - The action was successfully received, understood, and accepted.
- `4xx`: Client Error - The request contains bad syntax or cannot be fulfilled.
- `5xx`: Server Error - The server failed to fulfill an apparently valid request.


    Status-Code     =
            "200"   ;   OK
        |   "201"   ;   Created
        |   "400"   ;   Bad Request
        |   "401"   ;   Unauthorized
        |   "404"   ;   Not Found
        |   "405"   ;   Method Not Allowed
        |   "500"   ;   Internal Server Error
        |   "501"   ;   Not Implemented

### 5.2 Response Header Fields
The response-header fields allow server to pass additional information about the response, and about server itself.

    response-header =   "Server"
                    |   others

## 6. Student Entity
Request and Response messages may transfer student entity. The entity is represented in `JSON` format.

For Example:

    {
        "studentId": 11300240061,
        "name": "Renyu Liu",
        "gender": "male",
        "major": "Computer Science",
        "picture": <base64-encoded-pic>
    }
    
And student picture is encoded using `BASE64`.

## 7. Method Definitions
The set of common methods of SMP/1.0 is defined below.

### 7.1 GET
The GET method means retrieve the student information. The data shall be returned as the entity in the response unless other issue happened.

### 7.2 POST
The POST method means create a student information. Response status code should be 201 if succeeded.

### 7.3 PUT
The PUT method means update the student information. Response status code should be 200 if succeeded.

### 7.4 DELETE
The DELETE method means delete the student information. Response status code should be 200 if succeeded.

## 8. Status Code Definitions
### 200 OK
The request has succeeded.

### 201 Created
The request has been fulfilled and resulted in a new student information being created.

### 400 Bad Request
The request could not be understood by the server due to malformed syntax.

### 401 Unauthorized
The request is not authorized.

We authorize request through the `Authorization` header field.

### 404 Not Found
The student entity to be operate does not exist.

### 405 Method Not Allowed
The method to be applied is not allowed for such student entity.

### 500 Internal Server Error
The server encountered an unexpected condition which prevented it from fulfilling the request.

### 501 Not Implemented
The server does not support the functionality required to fulfill the request.

## 9. Header Fields Definitions
### 9.1 Authorization
This is the token of the authorization. We need to authorize client to perform some action such as, delete and update.

If the client is not authorized to perform, the response status code should be 401 (Unauthorized).

### 9.2 User-Agent
User-Agent is the text description of the client. Such as:

    MAC OSX NodeJS Client Version 1.0

### 9.3 Server
Server is the text description of the server.

    MAC OSX NodeJS Server Version 1.0

## 10. Protocol Implementation
We have our version of this protocol implemented by `NodeJS`. Because we can benefit from the asynchronous model and native `JSON` support.

You can find more in the source code.
