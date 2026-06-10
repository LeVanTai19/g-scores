// ----------- Hàm chuyển tab -----------
function switchTab(tabname, element) {

    // Ẩn tất cả các tab
    document.getElementById('section-search').style.display = 'none';
    document.getElementById('section-top10').style.display = 'none';
    document.getElementById('section-reports').style.display = 'none';

    // Hiển thị tab được click
    document.getElementById('section-' + tabname).style.display = 'block'; 

    // tab nào được chọn (active) thì sẽ có màu khác, còn lại sẽ ko có active
    const links = document.querySelectorAll('.menu-links .nav-link');
    links.forEach(link => {
        link.classList.remove('active');
    });
    element.classList.add('active');

    // Tự động gọi API khi click vào 2 tab này
    if (tabname === 'top10') fetchTop10();
    if (tabname === 'reports') fetchReport();
}

// ----------- feature 1: find student by SBD -----------
const inputSbd = document.getElementById('sbd-input');
const btnSearch = document.getElementById('btn-search');

btnSearch.addEventListener('click', async() =>{
    const sbd = inputSbd.value.trim();

    //Validation input
    if (!sbd) {
        alert ('Please enter a Registration Number!'); 
        return; 
    }

    // call API 
    try {
        const response = await fetch(`/api/scores/${sbd}`);
        const data = await response.json();

        if (!response.ok) {
            alert (data.message || 'Student not found!');
            return;
        }

        // có dữ liệu thì ẩn nền bãi biển đi và hiện ô kết quả
        document.getElementById('placeholder-section').style.display = 'none';
        document.getElementById('result-section').style.display = 'block';

        // Đổ dữ liệu vào khu vực kết quả
        const scoreDiv = document.getElementById('score-data');
        scoreDiv.innerHTML = `
            <div class="col-md-3 mb-3"><div class="p-3 border rounded bg-light"><strong>Toán:</strong> ${data.toan ?? '-'}</div></div>
            <div class="col-md-3 mb-3"><div class="p-3 border rounded bg-light"><strong>Ngữ Văn:</strong> ${data.van ?? '-'}</div></div>
            <div class="col-md-3 mb-3"><div class="p-3 border rounded bg-light"><strong>Ngoại Ngữ:</strong> ${data.ngoai_ngu ?? '-'}</div></div>
            <div class="col-md-3 mb-3"><div class="p-3 border rounded bg-light"><strong>Vật Lý:</strong> ${data.vat_ly ?? '-'}</div></div>
            <div class="col-md-3 mb-3"><div class="p-3 border rounded bg-light"><strong>Hóa Học:</strong> ${data.hoa_hoc ?? '-'}</div></div>
            <div class="col-md-3 mb-3"><div class="p-3 border rounded bg-light"><strong>Sinh Học:</strong> ${data.sinh_hoc ?? '-'}</div></div>
            <div class="col-md-3 mb-3"><div class="p-3 border rounded bg-light"><strong>Lịch Sử:</strong> ${data.lich_su ?? '-'}</div></div>
            <div class="col-md-3 mb-3"><div class="p-3 border rounded bg-light"><strong>Địa Lý:</strong> ${data.dia_ly ?? '-'}</div></div>
            <div class="col-md-3 mb-3"><div class="p-3 border rounded bg-light"><strong>GDCD:</strong> ${data.gdcd ?? '-'}</div></div>
        `;

    } catch (error) {
        console.error ('Error fetching score:', error);
        alert ('Something went wrong!');
    }  
});

// ----------- feature 2: retrive Top 10 students group A -----------
async function fetchTop10() {
    
    try {
        const response = await fetch('/api/scores/top/group-a');
        const data = await response.json();

        const tbody = document.getElementById('top10-table-body');
        tbody.innerHTML = ''; // xóa data cũ

        data.forEach((student, index) => {
            tbody.innerHTML += `
                <tr>
                    <td><strong>#${index + 1}</strong></td>
                    <td>${student.sbd}</td>
                    <td>${student.toan}</td>
                    <td>${student.vat_ly}</td>
                    <td>${student.hoa_hoc}</td>
                    <td class="text-danger fw-bold">${student.totalScore.toFixed(2)}</td>
                </tr>
            `;
        });

    } catch (error) {
        console.error('Error fetching top 10:', error);
    }
}

// ----------- feature 3: Reports (Chart) -----------
async function fetchReport() {
    
}