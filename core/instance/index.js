import { initMixin } from './init.js';
import { renderMixin } from './render.js';

function Due(options) {
    this._init(options);
    if(options.created != null) {
        options.created.call(this);
    }
    this._render();
}

// 混入初始化属性_init
initMixin(Due);
// 混入渲染属性_render
renderMixin(Due);

export default Due;