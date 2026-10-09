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


})