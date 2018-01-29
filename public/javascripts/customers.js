var listdatas = [];

$(document).ready(function () {
    getlist();
});

function getlist() {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/customer/all",
        cache: false,
        success: success,
        error: error
    });
};


function success(result) {
    if (result.status == 1) {
        //删除之前的数据
        $('#tb tr:gt(0)').remove();
        var s = '';
        result.data.forEach(function (item, index) {
            s += '<tr><td>' + '<input type="checkbox" name="select_item"></td><td>' + item._id + '</td><td>' + item.company + '</td><td>' + item.contacts + '</td><td>' + item.nativeplace + '</td><td>' + '<button>查看</button> <button onclick="delrow(this)">删除</button></td></tr>';
        })
        $('#tb').append(s);
        listdatas = result.data;
    } else {
        alert(result.message);
    }
}

function error() {
    alert("异常！");
}

function delrow(row) {
    mizhu.confirm('温馨提醒', '删除后无法恢复，确定要删除？', function (flag) {
        if (flag) {
            var rowidx = row.parentNode.parentNode.rowIndex;
            var _id = [listdatas[rowidx - 1]._id];
            $.ajax({
                type: "POST",
                dataType: "json",
                url: "/customer/del",
                data: {'ids': _id.toString()},
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
                    data: {'ids': ids},
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

function selectedcustomer() {
    var keyword = document.getElementById('keyword').value;
    if (keyword.length > 0) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "/customer/all",
            data: {'keyword': keyword},
            cache: false,
            success: success,
            error: error
        });
    }
    // 禁止界面跳转
    return false;
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