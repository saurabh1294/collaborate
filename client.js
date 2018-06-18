
window.onload = init;
		var langId = 0;
		var g_socket;
		var languages = ["Select Language", "Python", "Ruby", "Clojure", "PHP", "Plain Javascript", "Scala", "Go", "C/C++",
						"Java", "VB.Net", "C#", "Bash", "Objective C", "MySQL", "Perl", "Rust"];
		var themes = ["Chrome", "Clouds", "Crimson Editor", "Dawn", "Dreamweaver", "Eclipse", "IPlastic", "Solarized Light",
					"TextMate", "Tomorrow", "XCode", "Kuroir", "KatzenMilch", "SQL Server", "Ambiance", "Chaos",
					"Clouds Midnight", "Cobalt", "Gruvbox", "Green on Black", "Idle Fingers", "krTheme", "Merbivore",
					"Merbivore Soft", "Mono Industrial", "Monokai", "Pastel on Dark", "Solarized Dark", "Terminal",
					"Tomorrow Night", "Tomorrow Night Blue", "Tomorrow Night Bright", "Tomorrow Night 80s", "Twilight", "Vibrant Ink"];

		function check(text, which) {
			if (which === "languages") {
				return languages.some(function(lang) {
					return lang === text;
				});
			} else if (which === "themes") {
				return themes.some(function(theme) {
					return theme === text;
				});
			}
		}
		$('ul.js-selectable-langs>li').click(function(e) {
			e = e || window.event;
			var ul = $(this).parent();
			var index = ul.children().index(this);
			if (check(ul.prev().text(), "languages") !== -1) {
				changeMode(ul, index);
			}
			// set active language
			langId = index;
		});
		$('ul.js-selectable-themes>li').click(function(e) {
			e = e || window.event;
			var ul = $(this).parent();
			var index = ul.children().index(this);
			if (check(ul.prev().text(), "themes") !== -1) {
				var theme = ul.children().eq(index).attr('value');
				//console.log("Theme ", theme);
				editor1.setTheme(theme);
				var html = '<span class=\"caret\"></span>';
				$("#themes").html(ul.children().eq(index).html().replace(/<.*?>/g, '') + html);
			}
		});
		var editor1 = ace.edit("editor1");
		editor1.setOptions({
			enableBasicAutocompletion: true,
			enableSnippets: true,
			enableLiveAutocompletion: true
		});
		var codes = [
			"print 'Hello World!!';",
			"puts 'Hello World!!';",
			'(println "Hello World!!");',
			"echo 'Hello World!!';",
			"console.log('Hello World!!');",
			`object HelloWorld {
				def main(args: Array[String]) = println("Hello World!!");
			}`,


			`package main
			import \"fmt\"
			func main(){
				fmt.Printf("Hello World!!");
			}`,

			`#include <iostream>
			using namespace std;
			int main() {
				cout<<"Hello World";
				return 0;
			}`,

			`import java.io.*;
			class myCode
			{
				public static void main (String[] args) throws java.lang.Exception
				{
					System.out.println("Hello Java");
				}
			}`,

			`Imports System
			Public Class Test
				Public Shared Sub Main() 
					System.Console.WriteLine("Hello World!!")
				End Sub
			End Class`,

			`using System;
			public class Test
			{
				public static void Main()
				{
					Console.WriteLine("Hello World!!");
				}
			}`,

			"echo 'Hello World'",

			`#import <Foundation/Foundation.h>
			int main (int argc, const char * argv[])
			{
					NSAutoreleasePool *pool = [[NSAutoreleasePool alloc] init];
					NSLog (@"Hello, World!!!");
					[pool drain];
					return 0;
			}`,
			`USE DATABSE ri_db;
			CREATE TABLE USERS (
				UserID int,
				LastName varchar(255),
				FirstName varchar(255),
				Address varchar(255),
				City varchar(255) 
			);
			INSERT INTO USERS VALUES(1, 'Wick', 'John', '18, South Avenue, Street XYZ, Paris, France', 'Paris')`,

			`#!/usr/bin/perl
			print \'Hello World!!\'`,

			`fn main() {
				println!("Hello World!");
			}`
			];

		function init() {
			editor1.setTheme("ace/theme/chrome");
			// default mode
			editor1.getSession().setMode("ace/mode/python");
			editor1.focus();
			var json = {
				code: codes[0]
			};
			editor1.setValue(codes[0], -1);
			/*$.post("/beautify", json, function(data, error, xhr) {
				editor1.setValue(data.output, -1);
        	});*/
			//var html = '<span class=\"caret\"></span>';
			//$("#themes").html('Chrome' + html);
			//$("#languages").html('Python' + html);
			//$('ul#chatList').html('');
		}

		$('document').ready(function() {
			// initialize socket handle
			g_socket = window.term.__socket;
		});

		function changeMode(ul, index) {
			var mode = ul.children().eq(index).attr('value');
			//.eq(index).text();
			editor1.focus();
			console.log(mode.toLowerCase());
			editor1.getSession().setMode("ace/mode/" + mode.toLowerCase());
			var json = {
				code: codes[index]
			};
			/*$.post("/beautify", json, function(data, error, xhr) {
				editor1.setValue(data.output, -1);
				});*/
			editor1.setValue(codes[index], -1);
			var html = '<span class=\"caret\"></span>';
			$("#languages").html(ul.children().eq(index).html().replace(/<.*?>/g, '') + html);
		}

		function runCMD() {
			//COMPILE USER GIVEN CODE
			var langid = langId;
			var codeF = editor1.getValue();
			var stdin = $('#stdin')
				.val() || '';
			g_socket = g_socket || window.term.__socket;
			var sockArr = g_socket.url.split("/");
//window.term.__socket.url.split("/");
			// passing the json file to the page 
			var json = {
				language: langid,
				code: codeF,
				termPID: sockArr[sockArr.length-1],
				cmdLineArgs: $("#cmdLine").val()
			};
			//console.log(json);
			$("#send").attr("disabled", "true");
			$("#spin").css("display", "inline-block");
			$("#play").css("display", "none");
			$.post("/compile", json, function() {
					// successful
				})
				.done(function() {})
				.fail(function() {
					//document.getElementById("output").innerHTML = "Request Couldn't be completed!! Please retry..";
				})
				.always(function(data, error, xhr) {
					/*var errors = (data.errors) ? data.errors : '';
					var output = (data.output) ? data.output : '';
					document.getElementById("output")
						.innerHTML = output + errors;*/
					$("#send").removeAttr("disabled");
					$("#spin").css("display", "none");
					$("#play").css("display", "inline-block");
//					$("#cmdLine").html("Enter command line arguments separated by space");
				});
		}
		
	/*	
		$("#cmdLine").on("blur", function() {
//			$(this).html("Enter command line arguments separated by space");
		});
		
		$("#cmdLine").on("focus", function() {
//			$(this).html("");
		});*/

		$("#cmdLine").html("");


		
    // Client name
    var clientName;
	var listLength = 0;
	var clientList = [];
    // Configure editor
    /*var editor = ace.edit("editor");
    editor.setByAPI = false;
    editor.setFontSize(18);
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/javascript");*/

    //var socket = io.connect();
    /*socket.on('editorUpdate', function (data) {
        editor.setByAPI = true;
        editor.setValue(data.contents);
        editor.clearSelection();
        editor.setByAPI = false;
    });*/

		
    // prompt for client name, then get capability token from server
    $(function() {
        // Track user changes to the editor
        /*editor.on('change', function() {
            if (!editor.setByAPI) {
                socket.emit('editorUpdate', {
                    contents:editor.getValue()
                });
            }
        });*/

        // Handle UI to connect to conference call
        /*function resetCallInterface() {
            //$('button#vchat').html('Voice Chat');
            Twilio.Device.disconnectAll();
            callConnected = false;
        }*/

        //var callConnected = false;
        /*$('button#vchat').on('click', function() {
            if (!callConnected) {
                Twilio.Device.connect();
            }
            else {
                resetCallInterface();
            }
        });*/

        // Update call state and UI
        /*Twilio.Device.connect(function(conn) {
            callConnected = true;
            //$('button#vchat').html('Leave Voice Chat');
        });*/

        // Reset the UI on an error
        /*Twilio.Device.error(function(error) {
            console.log(error);
            resetCallInterface();
        });*/

        // Give editor time to render
        setTimeout(function() {
            // Get this user's chosen username
            uname = prompt('Please enter a username:');
            clientName = (uname) ? escape(uname.replace(' ','_')) : '';

            // Fetch a Twilio Client access token from the server
            $.ajax('/token', {
                data: {
                    clientName:clientName
                },
                success: function(token) {
                    // Set up Twilio soft phone
                    Twilio.Device.setup(token);

                    // Detect which clients are currently connected
                    var clients = clientList;
					
			Twilio.Device.activeConnection(function(conn){
				console.log("Connections ", conn);
			});
			// Display all connected clients in the ul
                        /*$('ul#chatList').html('');
                        for (var i = 0, l = clients.length; i<l; i++) {
			   // console.log("The client ", clients[i], "connected to this site");
	                   $('ul#chatList').append('<li>'+clients[i]+'</li>');
                        }*/

					
                    Twilio.Device.ready(function(e) {
                        // We don't have this client - add if available
                        if (clients.indexOf(e.from) < 0) {
                            e.available && clients.push(e.from);
                        }
                        // We already have this client - remove if not available
                        else {
                            e.available || clients.splice(clients.indexOf(e.from),1);
                        }

                        // Display all connected clients in the ul
                        // $('ul#chatList').html(''); - uncomment this later when we have the logic to remove a specific child from ul
                        
						
			// polling was done here earlier to get connected clients
			//var sockArr = window.term.__socket.url.split("/");
			g_socket = g_socket || window.term.__socket;
			var sockArr = g_socket.url.split("/");
			$.ajax('/clientId', {
				data: {
					clientName:clientName,
					id: sockArr[sockArr.length-1]
				},
				success: function(data) {
					//alert(clientName + " : "+data.clientId);	
					//TODO create a pair programming shareable link here on the editor
				},
							
				error: function(data) {
					console.log("Error fetching connected client's ID");
				}
			});
								
                    });
                }
            });

        },500);
    });
	
	
	
	// poll here every 1 second and get client List
	setInterval (function() {
		$.ajax('/clientList', {
			success: function(data) {
				// update client list here
				console.log("Clientlist = ", data.clientList);
				var numClients = data.clientList.length;
				var activeClients = data.clientList;
				if (listLength < numClients || listLength === 0) {
					// update list here
					if (listLength >= 0) {
						if (listLength > 0)
							$('ul#chatList').append('<li>'+activeClients[activeClients.length-1].name+'</li>');
							//$('ul#chatList').html('');
						else {
							for (var i = 0, l = activeClients.length; i<l; i++) {
								//console.log("The client ", clients[i], "connected to this site");
								$('ul#chatList').append('<li>'+activeClients[i].name+'</li>');
							}
						}
						//	$('ul#chatList').append('<li>'+activeClients[activeClients.length-1].name+'</li>');
					} 
				}
				if (listLength > numClients) {
					// optimize this block to remove disconnected clients
					$('ul#chatList').html('');
					for (var i = 0, l = activeClients.length; i<l; i++) {
						//console.log("The client ", clients[i], "connected to this site");
						$('ul#chatList').append('<li>'+activeClients[i].name+'</li>');
					}
				}
				listLength = data.clientList.length;
			},
			
			error: function(data) {
				console.log("Error fetching connected client's ID");
				$('ul#chatList').html('Server Disconnected');
			}
		});
	}, 500);	
})();