import markdownit from "markdown-it";

const md = markdownit({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true, // 启用一些语言学的替换和格式
  xhtmlOut: false, // 不使用 '/' 来闭合单标签
});
const defaultRender =
  md.renderer.rules.link_open ||
  function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  // Add a new `target` attribute, or replace the value of the existing one.
  tokens[idx].attrSet("target", "_blank");

  // Pass the token to the default renderer.
  return defaultRender(tokens, idx, options, env, self);
};

export default md;
