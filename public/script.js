// ----------- Hàm chuyển tab -----------
let isTop10Loaded = false;
let isReportLoaded = false;

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

    // kiểm tra trước khi gọi API khi click vào 2 tab này
    if (tabname === 'top10' && !isTop10Loaded) fetchTop10();
    if (tabname === 'reports' && !isReportLoaded) fetchReport();
}

// ----------- feature 1: find student by SBD -----------
const inputSbd = document.getElementById('sbd-input');
const btnSearch = document.getElementById('btn-search');

btnSearch.addEventListener('click', async() =>{
    const sbd = inputSbd.value.trim();

    // THÊM MỚI: báo lỗi dưới ô input
    const errorMsg = document.getElementById('sbd-error-msg');
    errorMsg.style.display = 'none';

    //Validation input
    if (!sbd) {
        errorMsg.innerText = 'Please enter a Registration Number!';
        errorMsg.style.display = 'block'; 
        return; 
    }

    // call API 
    try {
        const response = await fetch(`/api/scores/${sbd}`);
        const data = await response.json();

        if (!response.ok) {
            errorMsg.innerText = data.message || 'Student not found!';
            errorMsg.style.display = 'block';
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

    //THÊM MỚI: thông báo loading
    const loading = document.getElementById('loading-top10');
    const tbody = document.getElementById('top10-table-body');

    loading.style.display = 'block'; // hiện loading
    tbody.innerHTML = '';
    
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

        isTop10Loaded = true;

    } catch (error) {
        console.error('Error fetching top 10:', error);
    } finally {
        loading.style.display = 'none';
    }
}

// ----------- feature 3: Reports (Chart) -----------
let myChart = null; // biến toàn cục để lưu đối tượng biểu đồ, khi cần vẽ lại có thể xóa đi 

async function fetchReport() {

    //THÊM MỚI: thông báo loading
    const loading = document.getElementById('loading-reports');
    loading.style.display = 'block';

    try {
        console.log ("Đang lấy dữ liệu thống kê...");

        const response = await fetch('/api/scores/report/statistics');
        const data = await response.json();

        const subjects = ['toan', 'van', 'ngoai_ngu', 
                          'vat_ly', 'hoa_hoc', 'sinh_hoc', 
                          'lich_su', 'dia_ly', 'gdcd'];

        const level1 = []; // >= 8
        const level2 = []; // 6 - 8
        const level3 = []; // 4 - 6
        const level4 = []; // < 4 

        subjects.forEach(sub => {
            level1.push(data[sub]['>=8']);
            level2.push(data[sub]['6-8']);
            level3.push(data[sub]['4-6']);
            level4.push(data[sub]['<4']);
        })

        // Vẽ biểu đồ
        const ctx = document.getElementById('scoreChart').getContext('2d');

        if (myChart) {
            myChart.destroy();
        }

        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Toán', 'Ngữ Văn', 'Ngoại Ngữ', 'Vật Lý', 'Hóa Học', 'Sinh Học', 'Lịch Sử', 'Địa Lý', 'GDCD'],
                datasets: [
                    { label: '>= 8 điểm', data: level1, backgroundColor: '#17c3b2' }, 
                    { label: '6 -> 8 điểm', data: level2, backgroundColor: '#a8e6cf' }, 
                    { label: '4 -> 6 điểm', data: level3, backgroundColor: '#fdcb6e' }, 
                    { label: '< 4 điểm', data: level4, backgroundColor: '#ff7675' }    
                ]
            },
            options: {
                reponsive: true,
                maintainAspectRatio: false, // cho biểu đồ khớp với khung chứa
                scales: {
                    y: { beginAtZero: true }
                }
            }         
        });

        isReportLoaded = true;

    } catch (error) {
        console.error('Error fetching report:', error);
    } finally {
        loading.style.display = 'none';
    }
}