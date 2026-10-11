$(function (){
    function khoi(x1,y1,x2,y2){
        var kq=[];
        for(var y = y1; y <= y2; y++){
            for (var x = x1; x <= x2; x++){
                kq.push([x,y]);
            }
        }
        return kq;
    }
    var man = [
        {
            ten:'Khởi đầu của rắn',
            cot:30, hang:25, mili:300,dai:3,muc:10,
            tuong:khoi(5,2,5,7).concat(khoi(5,11,5,16), khoi(15,2,15,7), khoi(15,11,15,16), khoi(10,3,10,5)),
            mau:{nen1:'#262a33',nen2:'#2b303a',tuong:'#6f7787',ran:'#7be'},
            truyen:'trong cơn mưa lớn rắn nở ra giữa dãy núi nhiều yêu thú rắn phải nhanh chóng mạnh lên và bài học đầu đời là kiếm ăn',
            ketthuc:'rắn đã học được cách kiếm ăn và chuẩn bị đối diện với những thử thách lớn của đời rắn'
        }
    ]
    var $ban = $('#ban');
    var #modal = $('#modal');

    var man =0;
    var diem=0;
    var diemDauMan=0;
    var moiAn=0;
    var kyLuc=0;

    var ran=[];
    var huong={x:1,y:0};
    var hangDoi=[];
    var moi=null;
    var mapTuong={};
    var dsO=[];
    var oDaTo = [];
    var timer = null;
    var dangChoi = false;
    var tamDung = false;

    try{
        kyLuc= parseInt(localStorage.getItem("kyLuc"), 10)||0;
    } catch (e){
        kyLuc=0;
    }
    $('#kyluc').text(kyLuc);
    $('#tongman').text(man.length)

    function chuanHoa(giaTri, nho, lon) {
        if(lon == nho)
            return 0;
        return (giaTri - nho)/(lon-nho);

    }
    function tinhDoKho(i) {
        var m =man[i];
        var dau =man[0];
        var cuoi = man[man.length-1];
        var tocDo = chuanHoa(dau.mili - m.mili, 0, dau.mili -cuoi.mili);
        var san = chuanHoa(m.cot*m.hang, dau.cot*dau.hang, cuoi.cot*cuoi.hang);
        var dai = chuanHoa(m.dai,dau.dai,cuoi.dai);
        var tuong = chuanHoa(m.tuong.length, 0, cuoi.tuong.length);
        var tong = 0.4 * tocDo+0.25*san+0.2*dai + 0.15*tuong;
        return Math.round(10+tong*90);

    }
    function hienHop(tieuDe, noiDung,thongSo,chuNut,khiBam) {
        dangChoi = false;

        $('#mp-tieu-de').text(tieuDe);
        $('#mp-noi-dung').text(noiDung);

        var $ts = $('#mp-thong-so').empty();
        if(thongSo){
            for (var i = 0; i < thongSo.length; i++){
                $ts.append('<span class = "badge badge-pill">'+ thongSo[i] +'</span>');
            }
        }

    }


})