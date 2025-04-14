interface ApiConfigItem {
  url: string;
  methods: string;
  desc: string;
  key: string;
}

const API_CONFIG: ApiConfigItem[] = [
  {
    url: "/vx/login",
    methods: "get",
    desc: "登录",
    key: "LOGIN",
  },
  {
    url: "/app/banner/list",
    methods: "get",
    desc: "获取轮播图",
    key: "GET_BANNER_LIST",
  },
];

export default API_CONFIG;
