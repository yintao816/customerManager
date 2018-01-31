// 展示数据源
var listdatas = [];
// 当前页码 - 从1开始
var pageindex = 1;
// 总页数
var pagecount = 1;
// 是否是获取下一页
var isnext;

$(document).ready(function () {
    getlist(true);
});

function getlist(resetpage) {
    var relevantuser = window.localStorage.userinfo;
    if (!relevantuser || typeof relevantuser === 'undefine') {
        return
    }

    var keyword = document.getElementById('keyword').value;
    var arg = {'keyword': keyword, 'relevantuser': relevantuser};
    if (resetpage === true) {
        pageindex = 1;
    }else {
        if(listdatas.length >0) {
           arg['_id'] = isnext == true ? listdatas[listdatas.length - 1]._id : listdatas[0]._id;
        }
        arg['isnext'] = isnext;
    }
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/customer/all",
        data: arg,
        cache: false,
        success: success,
        error: error
    });
    // 禁止界面跳转
    return false;
}

function success(result) {
    if (result.status == 1) {
        pagecount = result.pagecount;
        //删除之前的数据
        $('#tb tr:gt(0)').remove();
        var s = '';
        result.data.forEach(function (item, index) {
            s += '<tr><td>' + '<input type="checkbox" name="select_item"></td><td>' + item._id + '</td><td>' + item.company + '</td><td>' + item.contacts + '</td><td>' + item.nativeplace + '</td><td>' + '<button>查看</button> <button onclick="delrow(this)">删除</button></td></tr>';
        })
        $('#tb').append(s);
        PagingManage1($('#pageIndex'),pagecount , pageindex);
        listdatas = result.data;
    } else {
        alert(result.message);
    }
}

function error() {
    $('#tb tr:gt(0)').remove();
    if (isnext === true) {
        pageindex--;
    }else {
        pageindex++;
    }
}

function delrow(row) {
    var relevantuser = window.localStorage.userinfo;
    if (!relevantuser || typeof relevantuser === 'undefine') {
        return
    }

    mizhu.confirm('温馨提醒', '删除后无法恢复，确定要删除？', function (flag) {
        if (flag) {
            var rowidx = row.parentNode.parentNode.rowIndex;
            var _id = [listdatas[rowidx - 1]._id];
            $.ajax({
                type: "POST",
                dataType: "json",
                url: "/customer/del",
                data: {'ids': _id.toString(), 'relevantuser': relevantuser},
                cache: false,
                success: function (res) {
                    if (res.status == 1) {
                        listdatas.splice(rowidx - 1, 1);
                        document.getElementById('tb').deleteRow(rowidx);
                    } else {
                        mizhu.alert('执行结果', res.message);
                    }
                },
                error: error
            });
        }
    });
}

function delall() {
    var relevantuser = window.localStorage.userinfo;
    if (!relevantuser || typeof relevantuser === 'undefine') {
        return
    }

    var arr = $("table td input[type=checkbox]:checked");
    var ids = '';
    for (var idx = 0; idx < arr.length; idx++) {
        var rowidx = arr[idx].parentNode.parentNode.rowIndex;
        ids += listdatas[rowidx - 1]._id + ',';
    }
    if (!ids) {
        mizhu.alert('温馨提醒', '没有勾选要删除的客户');
    } else {
        mizhu.confirm('温馨提醒', '删除后无法恢复，确定要删除？', function (flag) {
            if (flag) {
                ids = ids.substring(0, ids.length - 1);
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: "/customer/del",
                    data: {'ids': ids, 'relevantuser': relevantuser},
                    cache: false,
                    success: function (res) {
                        if (res.status == 1) {
                            for (var idx = 0; idx < arr.length; idx++) {
                                var rowidx = arr[idx].parentNode.parentNode.rowIndex;
                                listdatas.splice(rowidx - 1, 1);
                                document.getElementById('tb').deleteRow(rowidx);
                            }
                        } else {
                            mizhu.alert('执行结果', res.message);
                        }
                    },
                    error: error
                });
            }
        });
    }
}


function addcustomer() {
    window.open('/customer/add');
}

function selectall(checkbox) {
    var checkboxes = document.getElementsByName('select_item');
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = checkbox.checked;
    }
}

function switchPage(next) {
    if (next === true && pageindex < pagecount) {
        pageindex += 1;
    }else if(next === false && pageindex > 1) {
            pageindex -=1;
    }else {
        return
    }
    isnext = next;
    getlist(false);
}