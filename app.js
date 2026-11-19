// ===== 1. 获取 HTML 元素 =====
const diaryForm = document.getElementById("diary-form");
const diaryMood = document.getElementById("diary-mood");
const diaryText = document.getElementById("diary-text");
const diaryList = document.getElementById("diary-list");

// ===== 2. 读取 / 保存数据 =====
const STORAGE_KEY = "journal-records";
let records = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

// 今天的日期，格式是 "2026-11-07"
function todayString() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function deleteRecord(id) {
  const ok = confirm("この記録を削除しますか？");
  if (!ok) {
    return;
  }

  records = records.filter((r) => r.id !== id);
  saveRecords();
  renderDiaries();
}

// ===== 3. 点击保存按钮时 =====
diaryForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = diaryText.value.trim();
  if (text === "") {
    return;
  }

  const record = {
    id: Date.now(),
    date: todayString(),
    type: "diary",
    mood: diaryMood.value,
    text: text,
  };

  records.push(record);
  saveRecords();
  renderDiaries();
  diaryForm.reset();
  console.log("保存しました", records);
});

// ===== 4. 显示日记列表 =====
const moodLabels = {
  happy: "元気",
  normal: "ふつう",
  tired: "つかれた",
  sad: "かなしい",
};

function renderDiaries() {
  diaryList.innerHTML = "";

  const diaries = records
    .filter((r) => r.type === "diary")
    .sort((a, b) => b.id - a.id);

  diaries.forEach(function (diary) {
    const li = document.createElement("li");
    li.className = "diary-item";

    const meta = document.createElement("div");
    meta.className = "diary-meta";
    meta.textContent = `${diary.date} · ${moodLabels[diary.mood]}`;

    const body = document.createElement("p");
    body.textContent = diary.text;

    // 删除按钮
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "削除";
    deleteButton.addEventListener("click", function () {
      deleteRecord(diary.id);
    });

    // 把日期和正文装进一个盒子
    const content = document.createElement("div");
    content.className = "diary-content";
    content.appendChild(meta);
    content.appendChild(body);

    li.appendChild(content);
    li.appendChild(deleteButton);
    diaryList.appendChild(li);
  });
}

renderDiaries();