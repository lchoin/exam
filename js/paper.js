/**
 * Created by 婵 on 2016/9/28.
 * 试卷模块
 */
angular.module("app.paperModel",["ng","app.subjectModle"])
    .controller("paperListController",["$scope",function($scope){

    }])
    .controller("paperAddController",["$scope","commentService","paperModel","$routeParams","$location",function($scope,commentService,paperModel,$routeParams,$location){
        //调用app.subjectModle模块的commentService获取department数据
        commentService.getAllDepartment(function(data){
            $scope.departments=data;
        });
        $scope.model=paperModel.model;
        var id=$routeParams.id;
        if(id!=0){
            paperModel.addSubjectId(id);
            paperModel.addSubject(angular.copy($routeParams))
        }
        $scope.addPaper=function(){
            paperModel.addPaperSubject($scope.model,function(data){
                alert(data);
            })
        };
        $scope.delPaper=function(index){
           // alert(index)
           //  $location.path("/PaperAdd/id/0/stem/0/type/0/topics/0/level/0")
            commentService.getAllDepartment(function(data){
                $scope.model.subjects[index]=null;
                $scope.model.subjectIds[index]=null;
                $location.path("/PaperAdd/id/0/stem/0/type/0/topics/0/level/0")
            });
        }
    }])
    .factory("paperModel",["$http","$httpParamSerializer",function($http,$httpParamSerializer){
        return {
            model:{
                dId:1,
                title:"",
                desc:"",
                tt:"",
                at:"",
                subjectIds:[],
                subjects:[],
                scores:[]
            },
            addSubjectId:function(id){
                this.model.subjectIds.push(id);
            },
            addSubject:function(subject){
                this.model.subjects.push(subject)
            },
            // addScore:function(index,score){
            //     this.model.scores[index]=score
            // }
            addPaperSubject:function(params,handler){
                var obj={};
                for(var key in params){
                    var val=params[key];
                    switch(val){
                        case "dTd": obj[paper.department.id]=val;break;
                        case "title": obj[paper.title]=val;break;
                        case "desc": obj[paper.description]=val;break;
                        case "tt": obj[paper.totalPoints]=val;break;
                        case "at": obj[paper.answerQuestionTime]=val;break;
                        case "subjectIds": obj[subjectIds]=val;break;
                        case "scores": obj[scores]=val;break;
                    }
                };
                obj=$httpParamSerializer(obj)
                $http.post("http://172.16.0.5:7777/test/exam/manager/saveExamPaper.action",obj,{headers:{"content-type":"application/x-www-form-urlencoded"}}).success(function(data){handler(data)})
            }

        };
    }])