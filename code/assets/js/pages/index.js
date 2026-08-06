// ========================================
// エントリーポイント
// ========================================

function initialize() {
    addEventListeners();
}

document.addEventListener('DOMContentLoaded', function() {
    initialize();
});

// ========================================
// イベントリスナー
// ========================================
function addEventListeners() {
    const form = document.getElementById("userForm");
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        if (validateForm()) {
            // NOTE: 課題3にて、登録確認モーダルを表示するが、今は処理を行わない。
            alert("バリデーション成功！");
        }
    });

    document.getElementById("cancelButton").addEventListener("click", handleCancelButton);

    // 入力中・変更時にそのフィールドだけ再バリデーション
    document.getElementById("userNameInput").addEventListener("input", validateUserName);
    document.getElementById("birthdayInput").addEventListener("change", validateBirthDay);
    document.getElementById("ageInput").addEventListener("input", validateAge);
    document.getElementsByName("genderRadio").forEach(radio => {
        radio.addEventListener("change", validateGender);
    });
    document.getElementById("departmentSelect").addEventListener("change", validateDepartment);
    document.getElementById("relatedDepartmentSelect").addEventListener("change", validateRelatedDepartment);
}


// ========================================
// 入力バリデーション
// ========================================
function validateForm() {
    const validationResults = [
        validateUserName(),
        validateBirthDay(),
        validateAge(),
        validateGender(),
        validateDepartment(),
        validateRelatedDepartment(),
        validateUploadFile()
    ];

    const hasValidationError = validationResults.some(function(result) {
        return result === false;
    });

    if (hasValidationError) {
        showErrorToast("バリデーションエラーが発生しました。\n入力フォームを確認してください。");
        return false;
    }
    return true;
}

/**
 * ユーザー名の入力値を検証する関数
 * @description 空の場合NG。20文字以内であることを確認する。
 * @return {boolean} エラーメッセージ。エラーがない場合はundefinedを返す。
 */
function validateUserName() {
    const inputEl = document.getElementById("userNameInput");
    const errorEl = document.getElementById("userNameError");
    if (inputEl.value.trim() === "") {
        showFieldError(inputEl, errorEl, "ユーザー名を入力してください。");
        return false;
    }

    if (inputEl.value.length > 20) {
        showFieldError(inputEl, errorEl, "ユーザー名は20文字以内で入力してください。");
        return false;
    }

    clearFieldError(inputEl, errorEl);
    return true;
}

/**
 * 生年月日の入力値を検証する関数
 * @description 空の場合NG。現在より未来の日付でないことを確認する。
 * @return {boolean} エラーがない場合はtrue、エラーがある場合はfalseを返す。
 */
function validateBirthDay() {
    const inputEl = document.getElementById("birthdayInput");
    const errorEl = document.getElementById("birthdayError");
    if (inputEl.value.trim() === "") {
        showFieldError(inputEl, errorEl, "生年月日を入力してください。");
        return false;
    }

    const birthDate = new Date(inputEl.value);
    const today = new Date();
    if (birthDate > today) {
        showFieldError(inputEl, errorEl, "生年月日は今日以前の日付を入力してください。");
        return false;
    }
    clearFieldError(inputEl, errorEl);
    return true;
}

/**
 * 年齢の入力値を検証する関数
 * @description 空。0未満。数値以外。でないことを確認する。
 * @returns {boolean} エラーはない場合はtrue、エラー時はfalseを返す。
 */
function validateAge() {
    const inputEl = document.getElementById("ageInput");
    const errorEl = document.getElementById("ageError");
    if (inputEl.value.trim() === "") {
        showFieldError(inputEl, errorEl, "年齢は必ず入力してください。");
        return false;
    }
    if (isNaN(Number(inputEl.value))) {
        showFieldError(inputEl, errorEl, "数値以外の値は入力しないでください。");
        return false;
    }
    if (Number(inputEl.value) < 0) {
        showFieldError(inputEl, errorEl, "0以下の値は無効です。");
        return false;
    }
    clearFieldError(inputEl, errorEl);
    return true;
}

/**
 * 性別がいずれか選択されているかを検証する関数
 * @description 性別ラジオボタンのいずれかが選択されていることを確認する。
 * @returns {boolean} エラーがない場合はtrue、エラーがある場合はfalseを返す。
 */
function validateGender() {
    const radios = document.getElementsByName("genderRadio");
    const errorEl = document.getElementById("genderError");

    const isChecked = Array.from(radios).some(r => r.checked);
    if (!isChecked) {
        errorEl.textContent = "性別を選択してください。";
        return false;
    }

    errorEl.textContent = ""; // クリア
    return true;
}

/**
 * 部門が選択されているかを検証する関数
 * @description 部門セレクトボックスで選択されていることを確認する。
 * @returns {boolean} エラーがない場合はtrue、エラーがある場合はfalseを返す。
 */
function validateDepartment() {
    const inputEl = document.getElementById("departmentSelect");
    const errorEl = document.getElementById("departmentError");
    if (inputEl.value === "") {
        showFieldError(inputEl, errorEl, "部門を選択してください。");
        return false;
    }
    clearFieldError(inputEl, errorEl);
    return true;
}

/**
 * 関連部門が選択されているかを検証する関数
 * @description 関連部門セレクトボックスで選択されていることを確認する。1つも選択されていない場合はエラーとする。
 * @returns {boolean} エラーがない場合はtrue、エラーがある場合はfalseを返す。
 */
function validateRelatedDepartment() {
    const inputEl = document.getElementById("relatedDepartmentSelect");
    const errorEl = document.getElementById("relatedDepartmentError");
    if (inputEl.selectedOptions.length === 0) {
        showFieldError(inputEl, errorEl, "関連部門を選択してください。");
        return false;
    }
    clearFieldError(inputEl, errorEl);
    return true;
}

/**
 * アップロードファイルが有効かを検証する関数
 * @description ファイルが選択されていること、10kb以下であること、拡張子がtxtであることを確認する。
 * @returns {boolean} エラーがない場合はtrue、エラーがある場合はfalseを返す。
 */
function validateUploadFile() {
    // 未選択、10kb以上のファイル、拡張子がtxt以外のファイルはエラーとする
    const fileInput = document.getElementById("fileInput");
    const errorEl = document.getElementById("fileError");
    const file = fileInput.files[0];
    if (!file) {
        showFieldError(fileInput, errorEl, "ファイルを選択してください。");
        return false;
    }

    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (fileExtension !== "txt") {
        showFieldError(fileInput, errorEl, "拡張子はtxtのみ有効です。");
        return false;
    }

    if (file.size > 10 * 1024) {
        showFieldError(fileInput, errorEl, "ファイルサイズは10kb以下にしてください。");
        return false;
    }
    clearFieldError(fileInput, errorEl);
    return true;
}

// ========================================
// UI制御
// ========================================
/**
 * エラーメッセージを受け取り、トーストを表示する関数
 * @param {string} message 表示したいエラーメッセージ
 */
function showErrorToast(message) {
    const toastElement = document.getElementById("errorToast");
    const toastBody = toastElement.querySelector(".toast-body");
    
    // エラーメッセージを書き換え
    toastBody.textContent = message;

    // Bootstrapのトーストインスタンスを取得または生成して表示
    const toast = bootstrap.Toast.getOrCreateInstance(toastElement);
    toast.show();
}

/** フォームにエラーを表示する */
function showFieldError(inputEl, errorEl, message) {
    inputEl.classList.add("is-invalid");
    errorEl.textContent = message;
}

/** フォームのエラーをクリアする */
function clearFieldError(inputEl, errorEl) {
    inputEl.classList.remove("is-invalid");
    errorEl.textContent = "";
}

// ========================================
// 登録・キャンセル
// ========================================
function handleCancelButton() {
    const form = document.getElementById("userForm");
    form.reset();

    // is-invalid クラスをすべて除去
    form.querySelectorAll(".is-invalid").forEach(el => {
        el.classList.remove("is-invalid");
    });

    // エラーテキストをすべてクリア
    form.querySelectorAll(".invalid-feedback, .text-danger").forEach(el => {
        el.textContent = "";
    });
}