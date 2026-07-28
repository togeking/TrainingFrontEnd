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
        }
    });
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
    const userNameInput = document.getElementById("userNameInput");
    if (userNameInput.value.trim() === "") {
        return false;
    }

    if (userNameInput.value.length > 20) {
        return false;
    }

    return true;
}

/**
 * 生年月日の入力値を検証する関数
 * @description 空の場合NG。現在より未来の日付でないことを確認する。
 * @return {boolean} エラーがない場合はtrue、エラーがある場合はfalseを返す。
 */
function validateBirthDay() {
    const birthDateInput = document.getElementById("birthdayInput");
    if (birthDateInput.value.trim() === "") {
        return false;
    }

    const birthDate = new Date(birthDateInput.value);
    const today = new Date();
    if (birthDate > today) {
        return false;
    }
    return true;
}

/**
 * 年齢の入力値を検証する関数
 * @description 空。0未満。数値以外。でないことを確認する。
 * @returns {boolean} エラーはない場合はtrue、エラー時はfalseを返す。
 */
function validateAge() {
    const ageInput = document.getElementById("ageInput");
    if (ageInput.value.trim() === "") {
        return false;
    }
    if (isNaN(Number(ageInput.value))) {
        return false;
    }
    if (Number(ageInput.value) < 0) {
        return false;
    }
    return true;
}

/**
 * 性別がいずれか選択されているかを検証する関数
 * @description 性別ラジオボタンのいずれかが選択されていることを確認する。
 * @returns {boolean} エラーがない場合はtrue、エラーがある場合はfalseを返す。
 */
function validateGender() {
    const genderRadioButtons = document.getElementsByName("genderRadio");
    for (let i = 0; i < genderRadioButtons.length; i++) {
        if (genderRadioButtons[i].checked) {
            return true;
        }
    }
    return false;
}

/**
 * 部門が選択されているかを検証する関数
 * @description 部門セレクトボックスで選択されていることを確認する。
 * @returns {boolean} エラーがない場合はtrue、エラーがある場合はfalseを返す。
 */
function validateDepartment() {
    const departmentSelect = document.getElementById("departmentSelect");
    if (departmentSelect.value === "") {
        return false;
    }
    return true;
}

/**
 * 関連部門が選択されているかを検証する関数
 * @description 関連部門セレクトボックスで選択されていることを確認する。1つも選択されていない場合はエラーとする。
 * @returns {boolean} エラーがない場合はtrue、エラーがある場合はfalseを返す。
 */
function validateRelatedDepartment() {
    const relatedDepartmentSelect = document.getElementById("relatedDepartmentSelect");
    if (relatedDepartmentSelect.value === "") {
        return false;
    }
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
    const file = fileInput.files[0];
    if (!file) {
        return false;
    }
    if (file.size > 10 * 1024) {
        return false;
    }
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (fileExtension !== "txt") {
        return false;
    }
    return true;
}

// ========================================
// UI制御（トースト表示）
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