const loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
  if (!val) {
    return "请填写账号";
  }
  const resp = await API.exists(val);
  if (resp.data) {
    return "该账号已被注册，请重新填写！";
  }
});
const nickNameValidator = new FieldValidator("txtNickname", async function (
  val
) {
  if (!val) {
    return "请填写昵称";
  }
});
const loginPwdValidator = new FieldValidator("txtLoginPwd", async function (
  val
) {
  if (!val) {
    return "请填写密码";
  }
});
const loginPwdConfirmValidator = new FieldValidator(
  "txtLoginPwdConfirm",
  async function (val) {
    if (!val) {
      return "请再次确认密码";
    }
    if (val !== loginPwdValidator.input.value) {
      return "二次密码不一致！";
    }
  }
);
const form = $(".user-form");
form.onsubmit = async function (e) {
  e.preventDefault(); //阻止默认事件
  const result = await FieldValidator.validate(
    loginIdValidator,
    nickNameValidator,
    loginPwdValidator,
    loginPwdConfirmValidator
  );
  if (!result) {
    return; //验证未通过
  }
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  console.log(data);
  const resp = await API.reg(data);
  if (resp.code === 0) {
    alert("注册成功，点击确定，跳转到登录页面");
    location.href = "./login.html";
  }
};
