package main

import "net/http"

type Route struct {
	Name        string
	Method      string
	Pattern     string
	HandlerFunc http.HandlerFunc
}

type Routes []Route

var routes = Routes{
	Route{
		"LessonNames",
		"GET",
		"/lessonnames",
		GetLessonNames,
	},
	Route{
		"Lesson",
		"POST",
		"/lesson",
		GetLesson,
	},
	Route{
		"Courses",
		"GET",
		"/courses",
		GetCourses,
	},
}