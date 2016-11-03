/**
 * Created by 婵 on 2016/9/22.
 * 题库模块
 */
angular.module("app.subjectModle",["ng"])
    .controller("delController",["$scope","$location","$routeParams","subjectService",function($scope,$location,$routeParams,subjectService){
        //删除
        subjectService.delSubject($routeParams.id,function(data){
            alert(data);
            $location.path("/SubjectList/dpId/0/topicId/0/levelId/0/typeId/0")
        })
    }])
    .controller("subjectController",["$scope","commentService","subjectService","$filter","$routeParams","$location",function($scope,commentService,subjectService,$filter,$routeParams,$location){
        $scope.isShow=true
        $scope.params=$routeParams;
        var subjectModel =(function () {
            var obj = {};
            if($routeParams.typeId!=0){
                obj['subject.subjectType.id'] = $routeParams.typeId;
            }
            if($routeParams.dpId!=0){
                obj['subject.department.id'] = $routeParams.dpId;
            }
            if($routeParams.topicId!=0){
                obj['subject.topic.id'] = $routeParams.topicId;
            }
            if($routeParams.levelId!=0){
                obj['subject.subjectLevel.id'] = $routeParams.levelId;
            }
            return obj;
        })();
        //添加页面中的模板数据
        $scope.model = {
            typeId:1,
            dpId:1,
            levelId:1,
            topicId:1,
            stem:"",
            answer:"",
            analysis:"",
            choiceContent:[],
            choiceCorrect:[false,false,false,false]
        };
        //保存并继续
        $scope.add=function(){
            //调用Service方法完成题目保存
            subjectService.saveSubject($scope.model,function(data){
                alert(data);
            });
            var model = {
                typeId:1,
                dpId:1,
                levelId:1,
                topicId:1,
                stem:"",
                answer:"",
                analysis:"",
                choiceContent:[],
                choiceCorrect:[false,false,false,false]
            };
            angular.copy(model,$scope.model)
        }
        //保存并关闭
        $scope.addAndClose=function(){
            //调用service方法完成题目保存
            subjectService.saveSubject($scope.model,function(data){
                alert(data);
                $location.path("/SubjectList/dpId/0/topicId/0/levelId/0/typeId/0")
            })

        };

        commentService.getAllType(function(data){
            $scope.types=data;
        });
        commentService.getAllDepartment(function(data){
            $scope.departments=data;
        });
        commentService.getAllLevel(function(data){
            $scope.levels=data;
        });
        commentService.getAllTopics(function(data){
            $scope.topicss=data;
        });
        subjectService.getAllSubjects(subjectModel,function(data){
            data.forEach(function(subject){
                if(subject.subjectType && subject.subjectType.id!=3){
                    var answer=[];
                    subject.choices.forEach(function(choice,index){
                        if(choice.correct==true){
                            //将索引转换为A/B/C/D
                            var no=$filter('indexToNo')(index);
                            answer.push(no);
                        }
                    });
                    subject.answer=answer.toString();
                }
            });
            $scope.subjects=data;
        });
    }])
    .provider("commentService",function(){
        this.$get=function($http){
            return {
                getAllType:function(handler){
                    $http.get("data/types.json").success(function(data){
                        handler(data);
                    })
                },
                getAllDepartment:function(handler){
                    $http.get("data/department.json").success(function(data){handler(data)})
                },
                getAllLevel:function(handler){
                    $http.get("data/level.json").success(function(data){handler(data)})
                },
                getAllTopics:function(handler){
                    $http.get("data/topics.json").success(function(data){handler(data)})
                }
            }
        };
    })
    //题目服务
    .service("subjectService",["$http","$httpParamSerializer",function($http,$httpParamSerializer) {
        this.getAllSubjects = function (params, handler) {
            $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjects.action", {params: params}).success(function (data) {
                handler(data);
            });
        };
        //添加题目
        this.saveSubject=function(params,handler){
            var obj={};
            for(var key in params){
                var val=params[key];
                switch (key){
                    case "typeId":
                        obj['subject.subjectType.id']=val;
                        break;
                    case "levelId":
                        obj['subject.subjectLevel.id']=val;
                        break;
                    case "departmentId":
                        obj['subject.department.id']=val;
                        break;
                    case "topicId":
                        obj['subject.topic.id']=val;
                        break;
                    case "stem":
                        obj['subject.stem']=val;
                        break;
                    case "answer":
                        obj['subject.answer']=val;
                        break;
                    case "analysis":
                        obj['subject.analysis']=val;
                        break;
                    case "choiceContent":
                        obj['choiceContent']=val;
                        break;
                    case "choiceCorrect":
                        obj['choiceCorrect']=val;
                        break;
                }
            }
            //将对象数据转换为表单编码样式的数据
            obj=$httpParamSerializer(obj);
            $http.post("http://172.16.0.5:7777/test/exam/manager/saveSubject.action",obj,{headers:{"content-type":"application/x-www-form-urlencoded"} }).success(function(data){handler(data)})
        };
        this.delSubject=function(id,handler){
            $http.get("http://172.16.0.5:7777/test/exam/manager/delSubject.action",{
                params:{'subject.id':id}
            }).success(function(data){handler(data)})
        };
    }])
    .filter("indexToNo",function(){
        return function(input){
            var result;
            switch (input){
                case 0:result='A';break;
                case 1:result='B';break;
                case 2:result='C';break;
                case 3:result='D';break;
                case 4:result='E';break;
                default:result='F';break;
            }
            return result;
        }
    })
    .filter("selectTopics",function(){
        return function(input, id){
           if(input){
               //通过array中过滤器函数过滤满足条件的topics
              var arr=input.filter(function(item){
                   return item.department.id==id;
               });
               return arr;
           }
        };
    })
    .directive("selectOption",function(){
        return{
            restrict:"A",
            link:function(scope,element){
                element.on("change",function(){
                    var type=element.attr("type");
                    var isCheck=element.prop("checked");
                    if(type=="radio"){
                        scope.model.choiceCorrect=[false,false,false,false];
                        var index=angular.element(this).val();
                        scope.model.choiceCorrect[index]=true;
                    }else if(type == "checkbox" && isCheck ){
                        var index = angular.element(this).val();
                        scope.model.choiceCorrect[index] = true;
                    }
                    //强制将scope更新
                    scope.$digest();
                })
            }
        }
    })
