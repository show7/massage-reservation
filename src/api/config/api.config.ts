interface ApiConfigItem {
  url: string;
  methods: string;
  desc: string;
  key: string;
}

const API_CONFIG: ApiConfigItem[] = [
  ///app/cust/login
  {
    url: "/app/cust/login",
    methods: "POST",
    desc: "登陆",
    key: "LOGIN_WX",
  },

  {
    url: "/app/banner/list",
    methods: "get",
    desc: "获取轮播图",
    key: "GET_BANNER_LIST",
  },
  {
    url: "/app/project/list",
    methods: "get",
    desc: "项目列表",
    key: "GET_PROJECT_LIST",
  },
  {
    url: "/app/store/list",
    methods: "get",
    desc: "门店列表",
    key: "GET_STORE_LIST",
  },

  {
    url: "/app/work/tech/byProject",
    methods: "POST",
    desc: "根据项目查询技师",
    key: "GET_TECH_LIST_PROJECT",
  },
  ///app/work/tech/byStore
  {
    url: "/app/work/tech/byStore",
    methods: "POST",
    desc: "根据门店查询技师",
    key: "GET_TECH_LIST_STORE",
  },
  ///app/work/detail

  {
    url: "/app/work/detail",
    methods: "POST",
    desc: "查询技师排班信息",
    key: "GET_WORK_DETAIL",
  },
  {
    url: "/kt/app/custom/reservation",
    methods: "POST",
    desc: "预约",
    key: "RESERVATION",
  },
  {
    url: "/app/cust/loginV1",
    methods: "POST",
    desc: "登陆",
    key: "LOGIN",
  },
  {
    url: "/kt/app/custom/reservation/list",
    methods: "POST",
    desc: "我的预约列表",
    key: "GET_RESRVATION_LIST",
  },
  {
    url: "/kt/app/tech/reserver/reservation/list",
    methods: "POST",
    desc: "技师预约列表",
    key: "GET_TECH_RESRVATION_LIST",
  },
  {
    url: "/kt/tech/answer/add",
    methods: "POST",
    desc: "填写技师方案",
    key: "ADD_ANSWER",
  },
  {
    url: "/kt/app/custom/case/kt/sendCustInfoToTech",
    methods: "get",
    desc: "推送技师",
    key: "SEND_TE",
  },
  {
    url: "/app/tech/reserver/reservation/list",
    methods: "POST",
    desc: "非登录技师预约列表",
    key: "GET_NOTECH_RESRVATION_LIST",
  },
  
  {
    url: "/kt/app/custom/case/kt/add",
    methods: "POST",
    desc: "问题描述",
    key: "QT_ADD",
  },
  {
    url: "/kt/app/custom/case/kt/list",
    methods: "POST",
    desc: "问题描述列表",
    key: "QT_LIST",
  },
  
  {
    url: "/app/tech/reserver/case/byId",
    methods: "get",
    desc: "问题描述详情",
    key: "QT_INFO",
  },
  {
    url: "/kt/app/custom/reservation/cancel",
    methods: "POST",
    desc: "我的预约列表",
    key: "CANCEL_RESERVATION",
  },
  {
    url: "/app/cust/sendSms",
    methods: "GET",
    desc: "发送验证码",
    key: "SEND_SMS",
  },
  {
    url: "/kt/app/family/edit",
    methods: "POST",
    desc: "新增或编辑家人信息",
    key: "FADD_EDIT",
  },
  {
    url: "/kt/app/family/delete",
    methods: "GET",
    desc: "删除家人信息",
    key: "F_DELETE",
  },
  {
    url: "/kt/app/family/list",
    methods: "GET",
    desc: "查询家人信息",
    key: "F_LIST",
  },
  {
    url: "/kt/app/custom/case/kt/add",
    methods: "POST",
    desc: "问题描述",
    key: "QUESTION_ADD",
  },
  {
    url: "/kt/app/family/edit",
    methods: "POST",
    desc: "新增或编辑家人信息",
    key: "QUESTION_ADD",
  },
  
];

export default API_CONFIG;
