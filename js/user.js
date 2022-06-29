/**
 * 对某一个表单项进行验证的构造函数
 */
class FieldValidator {
  /**
   * 构造器
   * @param {*} txtId 文本框的Id
   * @param {*} validatorFunc 验证规则函数，当需要对该文本框进行验证时，会调用该函数
   */
  constructor(txtId, validatorFunc) {
    this.input = $("#" + txtId);
    this.p = this.input.nextElementSibling;
    this.validatorFunc = validatorFunc;
    this.input.onblur = () => {
      this.validate();
    };
  }
  async validate() {
    const err = await this.validatorFunc(this.input.value);
    if (err) {
      this.p.innerText = err;
      return false;
    } else {
      this.p.innerText = "";
      return true;
    }
  }
  /**
   * 对传入的所有验证器进行统一的验证，如果所有的验证都通过，则返回true，否则返回false;
   * @param  {FieldValidator[]} validators
   */
  static async validate(...validators) {
    const proms = validators.map((v) => v.validate());
    const result = await Promise.all(proms);
    return result.every((r) => r);
  }
}

// function test() {
//   FieldValidator.validate(loginIdValid, nickNameValid).then((result) => {
//     console.log(result);
//   });
// }
// test();
