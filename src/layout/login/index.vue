<template>
  <div class="login-container">
    <a-row type="flex" justify="center" class="login-content">
      <a-col :span="12">
        <div class="login-panel">
          <div class="login-panel--title">
            后台管理
          </div>
          <a-form
                  :form="form"
                  @submit="login"
                  layout="vertical"
                  class="login-form"
          >
            <a-form-item label="手机号">
              <a-input
                      v-decorator="[
                  'phone',
                  {
                    rules: [{ required: true, message: '请输入手机号' },
                    {pattern: /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/, message: '请输入正确手机号'}],
                  }
                ]"
                      size="large"
              />
            </a-form-item>
            <a-form-item label="验证码">
              <a-row :gutter="8">
                <a-col :span="16">
                  <a-input
                          v-decorator="[
                      'captcha',
                      {rules: [{ required: true, message: '请输入验证码' },
                      {len: 6, message: '请输入正确验证码'}]}
                    ]"
                          size="large"
                  />
                </a-col>
                <a-col :span="8">
                  <a-button type="primary" size="large" @click="getSmsCode" :disabled="disabled" class="login-btn">
                    {{maxtime?`${maxtime} s`:'获取验证码'}}
                  </a-button>
                </a-col>
              </a-row>
            </a-form-item>
            <a-form-item>
              <a-button
                      type="primary"
                      size="large"
                      html-type="submit"
                      class="login-btn"
              >
                登录
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<style lang="scss" scoped>
  @import './index.scss';
</style>
<script>
  import Auth from '../../model/auth'
  import {setAuthToken} from '../../utils/api'

  export default {
    data () {
      return {
        form: this.$form.createForm(this),
        loading: false,
        maxtime: null,
        timer: null,
        disabled: false
      }
    },
    components: {},
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    },
    methods: {
      getSmsCode (e) {
        e.preventDefault();
        this.form.validateFields(['phone'], (err, {phone}) => {
          if (err) {
            return;
          }
          this.AV.Cloud.requestSmsCode(phone).then(() => {
            this.$message.success('验证码已发送', 1)
            this.disabled = true
            this.maxtime = 60
            this.timer = setInterval(() => {
              if (this.maxtime >= 0) {
                this.maxtime = this.maxtime - 1;
              } else {
                this.maxtime = null
                this.disabled = false
                clearInterval(this.timer);
              }
            }, 1000);
          }, function (error) {
            console.error(error)
          });
        });
      },
      async login (e) {
        e.preventDefault();
        const {access_token} = await Auth.getAccessToken()
        setAuthToken(access_token)
        this.form.validateFields((err, {phone, captcha}) => {
          if (err) {
            return;
          }
          this.AV.User.signUpOrlogInWithMobilePhone(phone, captcha).then(() => {
            this.$router.push({path: '/'})
          }, () => {
            this.$message.success('验证码错误', 1)
          });
        });
      },
    },
    computed: {},
    watch: {}
  }
</script>
