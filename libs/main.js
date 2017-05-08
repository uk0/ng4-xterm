(function () {
    var d = document,
        w = window,
        p = parseInt,
        dd = d.documentElement,
        db = d.body,
        dc = d.compatMode == 'CSS1Compat',
        dx = dc ? dd: db,
        ec = encodeURIComponent;


    w.Xterm = {
        msgObj:d.getElementById("message"),
        screenheight:w.innerHeight ? w.innerHeight : dx.clientHeight,
        containerId:null,
        socket:null,
        //让浏览器滚动条保持在最低部
        scrollToBottom:function(){
            w.scrollTo(0, this.msgObj.clientHeight);
        },
        //退出，本例只是一个简单的刷新
        logout:function(){
            this.socket.disconnect();
            location.reload();
        },
        //提交bash内容
        submit:function(){
            var content = d.getElementById("content_bash").value;
            if(content != ''){
                var obj = {
                    containerid: this.containerId,
                    content: content
                };
                this.socket.emit('message', obj);
                d.getElementById("content_bash").value = '';
            }
            return false;
        },
        genUid:function(){
            return new Date().getTime()+""+Math.floor(Math.random()*899+100);
        },

        init:function(containerId){
            /*
             客户端根据时间和随机数生成uid,这样使得聊天室用户名称可以重复。
             实际项目中，如果是需要用户登录，那么直接采用用户的uid来做标识就可以
             */
            this.containerId = containerId;

            //连接websocket后端服务器
            this.socket = io.connect('ws://cgroup.itd:3000');

            //告诉服务器端有用户登录
            this.socket.emit('create', {containerid:this.containerId});

            //监听数据
            this.socket.on('start', function(o){

            });


            //监听消息发送
            this.socket.on('message', function(obj){
                var isme = (obj.containerId == Xterm.containerId) ? true : false;
                var contentDiv = '<div>'+obj.content+'</div>';
                var containerDiv = '<span>'+obj.containerId+'</span>';

                var section = d.createElement('section');
                if(isme){
                    section.className = 'containerID';
                    section.innerHTML = contentDiv + containerDiv;
                } else {
                    section.className = 'service';
                    section.innerHTML = containerDiv + contentDiv;
                }
                Xterm.msgObj.appendChild(section);
                Xterm.scrollToBottom();
            });

        }
    };
    //通过“回车”提交信息
    d.getElementById("content_bash").onkeydown = function(e) {
        e = e || event;
        if (e.keyCode === 13) {
            Xterm.submit();
        }
    };
})();