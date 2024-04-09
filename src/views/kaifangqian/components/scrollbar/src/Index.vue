<template>
  <div :class="`c-scrollbar c-scrollbar-${trigger}`"
       :style="{width,height,'max-height':maxHeight,'max-width':maxWidth}">
    <div :class="{'c-scrollbar-wrap':true,[`c-scrollbar-wrap-${direction}`]:true}"
         ref="wrapRef"
         :style="{'max-height':maxHeight,'max-width':maxWidth}"
         @scroll="handleScroll">

      <div class="c-scrollbar-content">
        <slot></slot>
      </div>

      <Bar direction="vertical"
           :parentRef="wrapRef"
           :size="state.vThumbHeight"
           :move="state.moveY"
           :barStyle="vBarStyle"
           :thumbStyle="vThumbStyle"
           v-show="hasVBar"
           class="c-scrollbar-bar-v-bar"
           v-if="direction !== 'x'"></Bar>

      <Bar direction="horizontal"
           :parentRef="wrapRef"
           :size="state.hThumbWidth"
           :move="state.moveX"
           :barStyle="hBarStyle"
           :thumbStyle="hThumbStyle"
           v-show="hasHBar"
           class="c-scrollbar-bar-h-bar"
           v-if="direction !== 'y'"></Bar>

    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, reactive, ref, toRefs } from 'vue';
import Bar from './Bar.vue';
import { addResizeListener, removeResizeListener } from './resize-event';

export default {
  name: 'c-scrollbar',
  components: {
    Bar,
  },
  props: {
    width: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '',
    },
    maxHeight: {
      type: String,
      default: '',
    },
    maxWidth: {
      type: String,
      default: '',
    },
    trigger: {
      type: String,
      default: 'always', // hover 鼠标移动上去显示 always 一直显示 none 不显示
    },
    noresize: Boolean, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
    direction: {
      type: String,
      default: 'all', // all 横向 纵向 都出现滚动条 x 水平 y 垂直
    },
    vBarStyle: Object,
    hBarStyle: Object,
    vThumbStyle: Object,
    hThumbStyle: Object,
  },
  data(){
    return {
      wrapRef: null,
      state:{
        vThumbHeight: '0',
        hThumbWidth: '0',
        moveX: '0%',
        moveY: '0%',
        hover: false
      },
      hasVBar: false,
      hasHBar: false
    }
  },
  methods:{
    /**
     * 真实滚动条滚动时，修改滚动条bar移动距离
     */
    handleScroll(event) {
      const { scrollTop, clientHeight, scrollLeft, clientWidth } = event.target;
      this.state.moveY = `${(scrollTop * 100) / clientHeight}%`;
      this.state.moveX = `${(scrollLeft * 100) / clientWidth}%`;
      this.$emit('scroll', event);
    },
    /**
     * 更新thumb的宽高 外层容器高度 / 整个内容的高度（整个可滚动内容区域） =  滚动条thumb的高度 / 滚动轨道的高度（一般滚动轨道的高度与外层容器相等）
     */
    update() {
      if (this.wrapRef) {
        const heightPercentage = (this.wrapRef.clientHeight * 100) / this.wrapRef.scrollHeight;
        const widthPercentage = (this.wrapRef.clientWidth * 100) / this.wrapRef.scrollWidth;

        if (heightPercentage < 100) {
          this.hasVBar = true;
        } else {
          this.hasVBar = false;
        }

        if (widthPercentage < 100) {
          this.hasHBar = true;
        } else {
          this.hasHBar = false;
        }
        state.vThumbHeight = heightPercentage < 100 ? `${heightPercentage}%` : '';
        state.hThumbWidth = widthPercentage < 100 ? `${widthPercentage}%` : '';
      }
    },
    setScrollTop(value) {
      this.wrapRef.scrollTop = value;
    },
    setScrollLeft(value) {
      this.wrapRef.scrollLeft = value;
    }
  },
  created(){
    // if (!this.noresize) {
    //   removeResizeListener(this.wrapRef, this.update());
    // }
  },
  mounted(){
    this.update(); // 初始化调用一次，计算滚动条默认高度
		// if(!this.noresize) {
		//   addResizeListener(this.wrapRef, this.update()); // 监听元素变化，如果容器DOM变化触发更新
		// }
  }
};
</script>

<style lang="less">
.c-scrollbar {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: transparent;

  &.c-scrollbar-hover {
    .c-scrollbar-bar {
      opacity: 0;
    }

    &:hover,
    &:focus,
    &:active {
      .c-scrollbar-bar {
        opacity: 1;
      }
    }
  }

  &.c-scrollbar-always {
    .c-scrollbar-bar {
      opacity: 1;
    }
  }

  &.c-scrollbar-none {
    .c-scrollbar-bar {
      opacity: 0;
    }
  }
}

.c-scrollbar-wrap-all {
  overflow: scroll;
}
.c-scrollbar-wrap-x {
  overflow-x: scroll;
  overflow-y: hidden;
}
.c-scrollbar-wrap-y {
  overflow-y: scroll;
  overflow-x: hidden;
}
.c-scrollbar-wrap {
  height: 100%;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
    display: none;
  }
}
</style>
