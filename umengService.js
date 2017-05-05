(function () {
    'use strict';

    angular
        .module('h5')
        .factory('umeng', umengService);

    umengService.$inject = ['Menu', '$rootScope'];

    /*
     * @class 友盟统计
     * @requires 引用统计脚本：http://open.cnzz.com/a/new/procedure/
     * @description
     * 接口列表：http://open.cnzz.com/a/api/apilist/
     * 测试工具：http://open.cnzz.com/a/tool/
     */
    function umengService(Menu, $rootScope)
    {
        var service =
            {
                trackEvent: _trackEvent,
                trackPageview: _trackPageview,
                currentCategory: _currentCategory
            };

        return service;

        /**
         * @description 用于发送页面上按钮等交互元素被触发时的事件统计请求。
         * 如视频的“播放、暂停、调整音量”，页面上的“返回顶部”、“赞”、“收藏”等。也可用于发送Flash事件统计请求。
         * @param {string} category 表示事件发生在谁身上，如“视频”、“小说”、“轮显层”等等。
         * @param {string} action 表示访客跟元素交互的行为动作，如"播放"、"收藏"、"翻层"等等。
         * @param {string} [label] 用于更详细的描述事件，如具体是哪个视频，哪部小说。
         * @param {number} [value] 用于填写打分型事件的分值，加载时间型事件的时长，订单型事件的价格
         * @param {string} [nodeid] 填写事件元素的div元素id。
         */
        function _trackEvent(category, action, label, value, nodeid)
        {
            if (!window._czc) { return; }

            var entity = ['_trackEvent'];
            if (category) { entity.push(category); } else { return;}
            if (action) { entity.push(action); } else { return; }
            entity.push(label || null);
            entity.push(value || 1);
            entity.push(nodeid || null);
            try {
                _czc.push(entity);
            }
            catch (err)
            {
                console.error(err);
            }
        }

        /**
         * 用于发送某个URL的PV统计请求，适用于统计AJAX、异步加载页面，友情链接，下载链接的流量。
         * @param content_url 自定义虚拟PV页面的URL地址
         * 填写以斜杠‘/’开头的相对路径，系统会自动补全域名
         * @param referer_url 自定义该受访页面的来源页URL地址
         * 建议填写该异步加载页面的母页面。
         * 不填，则来路按母页面的来路计算。
         * 填为“空”，即""，则来路按“直接输入网址或书签”计算。
         */
        function _trackPageview(content_url, referer_url)
        {
            if (!window._czc) { return; }

            var entity = ['_trackPageview'];

            if (content_url) { entity.push(content_url); } else { return; }

            entity.push(referer_url || null);

            try {
                _czc.push(entity);
            }
            catch (err) {
                console.error(err);
            }
        }

        /**
         * 根据当前页面生成统计用的category
         */
        function _currentCategory()
        {
            try
            {
                if (Menu && Menu.data.length > 0) {

                    var page = Menu.selectedMenu;

                    if (!page)
                    {
                        console.error('未找到页面');

                        return "";
                    }

                    var category = page.Name;

                    if (page && page.ParentMenuId) {

                        page = Menu.findMenu(page.ParentMenuId);

                        if (page.menu.Name) { category = page.main.Name + ' - ' + category; }
                    }

                    return category;
                }
            }
            catch (err) {
                console.error(err);
            }
        }
    }
})();