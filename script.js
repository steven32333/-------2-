// 問題庫
const questions = {
    truth: [
        "你最近一次說謊是什麼時候？說了什麼謊？",
        "你最引以為傲的事情是什麼？",
        "你最後悔的一件事是什麼？",
        "你暗戀過的人中，最後悔沒表白的是誰？",
        "你做過最瘋狂的事情是什麼？",
        "如果可以重來一次，你最想改變人生中的哪一個決定？",
        "你心目中理想的對象是什麼樣的？",
        "你最喜歡的一次旅行是去哪裡？為什麼？",
        "你最害怕什麼？為什麼？",
        "你最想對在場的某個人說什麼？"
    ],
    dare: [
        "用雞叫聲唱一首歌",
        "模仿一位在場朋友的說話方式",
        "打電話給爸媽說「我愛你」",
        "做一個大家覺得最符合你的表情",
        "即興表演一段尬舞",
        "用手機最後一張自拍照作為大頭貼一週",
        "用英語講一個笑話",
        "閉著眼睛畫一隻貓",
        "做三個引體向上（如果做不到可以做其他運動）",
        "學三種動物的叫聲"
    ]
};

// 用於追蹤已經出現過的問題
let usedQuestions = {
    truth: new Set(),
    dare: new Set()
};

// 取得隨機問題
function getRandomQuestion(type) {
    const availableQuestions = questions[type].filter(q => !usedQuestions[type].has(q));
    
    // 如果所有問題都被用過了，重置記錄
    if (availableQuestions.length === 0) {
        usedQuestions[type].clear();
        return questions[type][Math.floor(Math.random() * questions[type].length)];
    }
    
    const question = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    usedQuestions[type].add(question);
    return question;
}

// DOM 元素
const truthBtn = document.getElementById('truthBtn');
const dareBtn = document.getElementById('dareBtn');
const resultContainer = document.querySelector('.result-container');
const result = document.getElementById('result');
const nextBtn = document.getElementById('nextBtn');

// 當前問題類型
let currentType = null;

// 事件監聽器
truthBtn.addEventListener('click', () => showQuestion('truth'));
dareBtn.addEventListener('click', () => showQuestion('dare'));
nextBtn.addEventListener('click', () => showQuestion(currentType));

function showQuestion(type) {
    currentType = type;
    const question = getRandomQuestion(type);
    
    // 隱藏原本的按鈕
    truthBtn.style.display = 'none';
    dareBtn.style.display = 'none';
    
    // 顯示問題和下一題按鈕
    resultContainer.classList.remove('d-none');
    nextBtn.classList.remove('d-none');
    
    // 添加動畫效果
    result.className = 'h4 mb-0 animate__animated animate__fadeIn';
    result.textContent = question;
}

// 返回主選單
nextBtn.addEventListener('dblclick', () => {
    truthBtn.style.display = '';
    dareBtn.style.display = '';
    resultContainer.classList.add('d-none');
    nextBtn.classList.add('d-none');
    currentType = null;
});