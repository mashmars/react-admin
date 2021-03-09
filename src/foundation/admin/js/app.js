console.log('技术开发: 马帅');
console.log('邮箱: 402738923@qq.com');
console.log('手机号: 15890143123');
$(document).foundation()
// 左侧菜单点击
$('.left-sidebar li').click(function(){ 
    var is_open = $(this).attr('aria-expanded');
    if(is_open == 'true'){  
        $(this).find('a.parent').css({'border-left':"3px solid #18bc9c"});
    }else{       
        $(this).find('a.parent').css({'border-left':"none"});
    }
})
/***左侧菜单 当前链接 */
/* $('.left-sidebar a').each(function(){
    var router = $(this).attr('data-router');
    var current_router = "{{ app.request.attributes.get('_route') }}";
    var tmp = current_router.split('.');
    tmp = tmp[0]+'.'+tmp[1];              
    if(router == tmp){
        $(this).parent().addClass('is-active');                    
        $(this).parents('ul').css('display','block');                    
    }
}) */

/**查询切换 */
$('.search').click(function () {
    $('#search').toggle();
})
/**a链接删除 */
$('a.href-delete,button.href-delete').on('click',function(e){
    var href = $(this).attr('data-href');
    var disabled = $(this).prop('disabled'); 
    get_href_delete(e,href,disabled,$(this).attr('data-title'));
})
/**a链接编辑 */
$('button.href-edit').on('click',function(e){
    var href = $(this).attr('data-href');
    var disabled = $(this).prop('disabled'); 
    if(disabled) return false;  
    layer.load(2); 
    location.href = href ;
})
/**审核 a */
$('a.ajax-shenhe,button.ajax-shenhe').on('click',function(){    
    var id = $(this).attr('data-id');
    var href = $(this).attr('data-href');
    var disabled = $(this).attr('disabled');
    var title = $(this).attr('data-title');
    if(!title){
        title = '是否确认审核？';
    }
    if(disabled) return false;
    layer.confirm(title,{'title':title},function(){
        layer.load(2);
        $.post(href,{id:id},function(data){
            if(data.code == 0){
                layer.msg(data.msg,{time:2000,icon:1},function(){
                    location.reload();
                })
            }else{
                layer.msg(data.msg,{time:2000,icon:5})
            } 
            layer.closeAll('loading');          
        })        
    })
})

$('body').on('click', 'a.ajax-delete,button.ajax-delete', function(){
    var id = $(this).attr('data-id');
    var href = $(this).attr('data-href');
    var disabled = $(this).attr('disabled');
    var title = $(this).attr('data-title');
    if(!title){
        title = '是否确认审核？';
    }
    if(disabled) return false;
    var obj = $(this);
    layer.confirm(title,{'title':title},function(){
        layer.load(2);
        $.post(href,{id:id},function(data){
            if(data.code == 0){
                layer.msg(data.msg,{time:2000,icon:1},function(){
                    //location.reload();
                    $(obj).parents('tr').remove();
                })
            }else{
                layer.msg(data.msg,{time:2000,icon:5})
            } 
            layer.closeAll('loading');          
        })        
    })
})

//
$('body').on('change', '.switch-input', function() {
    let val = $(this).prop("checked") ? 1 : 0;
    let href = $(this).attr("data-href");
    let id = $(this).attr("data-id");
    layer.load(2);
    $.post(href,{id:id, status:val},function(data){
        if(data.code == 0){
            layer.msg(data.msg,{time:1000,icon:1},function(){
                
            })
        }else{
            layer.msg(data.msg,{time:2000,icon:5})
        } 
        layer.closeAll('loading');          
    })  
})

/**layer open 打开iframe窗口 */
$('body').on('click', '.layer-open', function(){ 
    if(!$(this).attr('data-href')) return false;
    layer_open($(this).attr('data-title'),$(this).attr('data-href'));
})
$('.layer-open-return').click(function(){
    var flag = $(this).hasClass('multiplu'); //是否需要返回多个字段    
    layer_open_return($(this).attr('data-title'),$(this).attr('data-href'),flag);
})



//全选 or 全不选
$('.checkbox-ids').click(function(){
    if($(this).prop('checked')){
        $('.checkbox-id').each(function(){
            if (!$(this).prop("disabled")) {
                $(this).prop('checked', true);
            }
        })
    }else{
        $('.checkbox-id').each(function(){
            $(this).prop('checked', false);
        })
    }
})

// 搜索
$('#button-search').click(function(){
    $('#form-search').submit();
})




/*************************FUNCTIONS**********************/
function stopDefault(e) {
    if (e && e.preventDefault) e.preventDefault();
    else
        window.event.returnValue = false;
} 
function get_href_delete(e,href,dd, title=false)
{
    stopDefault(e);
    if(dd) return false;
    if(!title){
        title = '是否确认删除?';
    }       
    layer.confirm(title,{'title':title},function(){
        layer.load(2);
        location.href = href ;
    })
}

/***layer open iframe窗口 */
function layer_open(title,url)
{
    layer.open({
        type: 2,
        title: title,
        shadeClose: true,
        shade: 0.8,
        area: ['90%', '90%'],
        //content: "{{ path('admin.product.card_create',{'id':"+id+"}) }}" //iframe的url
        content: url, //iframe的url
        
    });
}
//如果flag为true 则需要post提交，否则 get
function layer_open_return(title,url,flag)
{
    layer.open({
        type: 2,
        title: title,
        shadeClose: true,
        shade: 0.8,
        area: ['70%', '80%'],
        //content: "{{ path('admin.product.card_create',{'id':"+id+"}) }}" //iframe的url
        content: url, //iframe的url
        btn: ['确定','关闭'],
        yes: function(index,layero){
            //当点击‘确定’按钮的时候，获取弹出层返回的值
            var body = layer.getChildFrame('body', index);            
            if(!flag){
                var value = body.find('#choose_id').val() ; //此处需要约定input or textarea的id
                //var res = window["layui-layer-iframe" + index].callbackdata(value); //调用下面的函数callbackdata
                //打印返回的值，看是否有我们想返回的值。
                //console.log(res);
                //请求            
                var url = window.location.href ;
                url = url.split('?')[0] + '?id='+value ;
                location.href = url ;    
            }else{
                //需要提示当前form的隐藏域，然后post提交
            }        
            //最后关闭弹出层
            layer.close(index);
        },
        /** 调用后设置子页面的值
        success: function(layero, index){
            var body = layer.getChildFrame('body', index);            
            body.find('input[name=order]').val('Hi，我是从父页来的')
          }
        */
    });
}
var callbackdata = function (value) {
    var data = {
        id: value
    };
    return data;
}
