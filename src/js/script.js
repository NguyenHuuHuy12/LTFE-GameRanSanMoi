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
    var Cacman = [
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
    var oMoi =null;
    var coO=24;
    
    var timer = null;
    var dangChoi = false;
    var tamDung = false;

    try{
        kyLuc= parseInt(localStorage.getItem("kyLuc"), 10)||0;
    } catch (e){
        kyLuc=0;
    }
    $('#kyluc').text(kyLuc);
    $('#tongman').text(Cacman.length)

    function chuanHoa(giaTri, nho, lon) {
        if(lon == nho)
            return 0;
        return (giaTri - nho)/(lon-nho);

    }
    function tinhDoKho(i) {
        var m =Cacman[i];
        var dau =Cacman[0];
        var cuoi = Cacman[Cacman.length-1];
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
        $('#mp-nut').text(chuNut).prop('disabled', false).off('click').on('click', function (){
            $(this).prop('disabled', true);
           $modal.one('hidden.bs.modal', khiBam).modal('hide');
        });
        $modal.modal('show');

    }
    $modal.on('hidden.bs.modal', function (){
        $('#mp-nut').trigger('focus')
    });
    function thongSoMan(i) {
        var m=Cacman[i];
        return[
            'Toc do: <b>'+Math.round(10000/m.mili)/10+'o</b>',
            'San: <b>'+m.cot+'x'+m.hang+'</b>',
            'Ran: <b>'+m.dai+'dot</b>',
            'Muc tieu:<b>'+m.muc+'tao</b>',
            'Do kho:<b>'+tinhDoKho(i)+'%</b>'
        ];

    }
    function hienCotTruyen() {
        var m =Cacman[man];
        dungSan();
        hienHop('Man'+(man+1)+':'+m.ten,m.truyen,thongSoMan(man),'Bat dau',batDauMan);
    }
    function lay0(x,y) {
        return dsO[y*man[man].cot+x];
        
    }
    function tinhCoO() {
        var m =Cacman[man];
        var rong = $('#khung-ban').width()-14;
        var cao =$(window).height()-230;
        if($(window).width()<768) cao-=90;
        coO = Math.floor(Math.min(rong/m.cot, cao/m.hang, 30));
        if(coO<10) coO=10;
        $ban.css({
            '--o': coO+'px',
            'grid-template-colums': 'repeat(' +m.cot+','+coO+'px)'
        });
        
    }
    function dungSan() {
        var m =Cacman[man];
        var html ='';
        var x,y,i;
        
        for (y=0;y<m.hang;y++){
            for(x=0;x<m.cot;x++){
                html += '<div class="o' +(((x+y)%2 ===0)? 'chan' :'le')+'"></div>';
                
            }
        }
        $ban.html(html).removeClass('thua');
        dsO =$ban.children().toArray();
        oDaTo=[];
        oMoi = null;
        
        $ban.css({
            '--nen1': m.mau.nen1,
            '--nen2': m.mau.nen2,
            '--tuong': m.mau.tuong,
            '--ran': m.mau.ran,
        });
        tinhCoO();
        mapTuong ={};
        for (i=0;i<m.tuong.length;i++){
            var tx = m.tuong[i][0];
            var ty = m.tuong[i][1];
            mapTuong[tx +','+ty] =true;
            lay0(tx,ty).classList.add('tuong');
        }
        
    }
    function batDauMan() {
        var m =Cacman[man];
        clearTimeout(timer);
        tamDung =false;
        $('#nut-dung i').attr('class', 'fa-solid -fa-pause');
        dungSan();
        var gx =Math.floor(m.cot/2);
        var gy =Math.floor(m.hang/2);
        ran=[];
        for (var j=0 ; j<m.dai; j++){
            ran.push({x: gx-j, y: gy})
        }
        huong ={x:1,y:0};
        hangDoi=[];
        moiAn=0;
        diem=diemDauMan;
        capNhatHub();
        sinhMoi();
        ve();

        dangChoi = true;
        timer = setTimeout(buocDi,700);
    }
    function capNhatHub() {
        var m =Cacman[man];
        var dk = tinhDoKho(man);

        $('#soman').text(man+1);
        $('#somoi').text(moiAn);
        $('#muc-tieu').text(m.muc);
        $('#diem').text(diem);
        $('#kyluc').text(kyLuc);
        $('#so-do-kho').text(dk+'%');
        $('#vach-do-kho').css('width',dk+'%').removeClass('bg-success bg-warning bg-danger').addClass(dk<40? 'bg-success':(dk<70? 'bg-warning':'bg-danger'));

    }
    function sinhMoi() {
        var m =Cacman[man];
        var trong = [];

        for(var y=0;y<m.hang;y++){
            for(var x=0;x<m.cot;x++){
                if(mapTuong[x+','+y]) continue;
                var trung=false;
                for(var k=0;k<ran.length;k++){
                    if(ran[k].x===x && ran[k].y===y){
                        trung=true;
                        break;
                    }
                    if(!trung) trong.push({x:x,y:y});
                }
            }
            moi=trong[Math.floor(Math.random()*trong.length)];
            if(oMoi) oMoi.classList.remove('moi');
            oMoi = lay0(moi.x,moi.y);
            oMoi.classList.add('moi');

        }

    }


})