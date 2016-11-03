/**
 * Created by 婵 on 2016/9/22.
 * 这是项目的核心js
 */
//左侧导航动画
$(function(){
    //收缩全部
    $(".baseUI>li>ul").slideUp("fast");
    $(".baseUI>li>a").off("click");
    $(".baseUI>li>a").on("click",function(){
        $(".baseUI>li>ul").slideUp("fast");
        $(this).next().slideDown();
    });
    //默认让第一个展开
    $(".baseUI>li>a").eq(0).trigger("click");
    //背景改变
    $(".baseUI ul>li").off("click");
    $(".baseUI ul>li").on("click",function(){
        if(!$(this).hasClass("current")){
            $(this).addClass("current").siblings().removeClass("current");
        }
    });

    //默认点击第一个a
    $(".baseUI ul>li").eq(0).find("a").trigger("click");

});
angular.module("app",["ng","ngRoute","app.subjectModle","app.paperModel"])
    .controller("mainController",["$scope",function($scope){

    }])
    .config(["$routeProvider",function($routeProvider){
        $routeProvider.when("/SubjectList/dpId/:dpId/topicId/:topicId/levelId/:levelId/typeId/:typeId",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectController"
        }).when("/subjectManger",{
            templateUrl:"tpl/subject/subjectManger.html",
            controller:"subjectController"
        }).when("/subjectAdd",{
            templateUrl:"tpl/subject/subjectAdd.html",
            controller:"subjectController"
        }).when("/subjectDel/id/:id",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"delController"
        }).when("/paperList",{
            templateUrl:"tpl/paper/paperManager.html",
            controller:"paperListController"
        }).when("/PaperAdd/id/:id/stem/:stem/type/:type/topics/:topics/level/:level",{
            templateUrl:"tpl/paper/paperAdd.html",
            controller:"paperAddController"
        }).when("/paperAddSubject",{
            templateUrl:"tpl/paper/subjectList.html",
            controller:"subjectController"
        });
    }])
