angular.module('chatApp', ['open-chat-framework'])
  .run(['$rootScope', 'ngChatEngine', function($rootScope, ngChatEngine) {
    $rootScope.ChatEngine = ChatEngineCore.create({
      publishKey: 'pub-c-d8599c43-cecf-42ba-a72f-aa3b24653c2b',
      subscribeKey: 'sub-c-6c6c021c-c4e2-11e7-9628-f616d8b03518'
    }, {
      debug: true,
      globalChannel: 'chat-engine-angular-simple1'
    });

    // bind open chat framework angular plugin
    ngChatEngine.bind($rootScope.ChatEngine);
  }])
  .controller('chatAppController', function($scope) {
    $scope.ChatEngine.connect(new Date().getTime(), {}, 'auth-key');

    $scope.ChatEngine.on('$.ready', (data) => {
      $scope.me = data.me;

      $scope.me.plugin(ChatEngineCore.plugin['chat-engine-random-username']($scope.ChatEngine.global));

      // bind chat to updates
      $scope.chat = $scope.ChatEngine.global;
      $scope.chat.plugin(ChatEngineCore.plugin['chat-engine-online-user-search']({ prop: 'state.username' }));
    });

    $scope.search = function () {
      let found = $scope.chat.onlineUserSearch.search($scope.mySearch);

      // hide every user
      for(let uuid in $scope.chat.users) {
        $scope.chat.users[uuid].hideWhileSearch = true;
      }

      // show all found users
      for(let i in found) {
        $scope.chat.users[found[i].uuid].hideWhileSearch = false;
      }
    }
  });
