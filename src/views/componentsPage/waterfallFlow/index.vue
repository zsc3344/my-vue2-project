<template>
  <div class="waterfall-container">
    <div class="waterfall-column" v-for="(column, columnIndex) in columns" :key="columnIndex">
      <div 
        class="card" 
        v-for="item in column" 
        :key="item.id"
        @click="handleCardClick(item)"
      >
        <div class="card-image">
          <img :src="item.image" :alt="item.title" @error="handleImageError">
        </div>
        <div class="card-content">
          <h3 class="card-title">{{ item.title }}</h3>
          <p class="card-description">{{ item.description }}</p>
          <div class="card-footer">
            <div class="user-info">
              <img :src="item.avatar" class="avatar" :alt="item.username">
              <span class="username">{{ item.username }}</span>
            </div>
            <div class="likes">
              <i class="heart-icon">❤️</i>
              <span>{{ item.likes }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WaterfallFlow',
  data() {
    return {
      items: [],
      columns: [],
      columnCount: 2,
      imageCollection: [
        'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
        'https://images.unsplash.com/photo-1682687221038-404670f09ef1',
        'https://images.unsplash.com/photo-1682687220063-4742bd7fd538',
        'https://images.unsplash.com/photo-1682687220067-469c0f7ec851',
        'https://images.unsplash.com/photo-1682687220199-d0124f48f95b',
        'https://images.unsplash.com/photo-1682687220923-c58b9a4592ae',
        'https://images.unsplash.com/photo-1682687221175-947d2aedb651',
        'https://images.unsplash.com/photo-1682687220945-922198770e60'
      ],
      avatarCollection: [
        'https://images.unsplash.com/photo-1633332755192-727a05c4013d',
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        'https://images.unsplash.com/photo-1527980965255-d3b416303d12'
      ]
    }
  },
  methods: {
    getRandomImage() {
      const randomIndex = Math.floor(Math.random() * this.imageCollection.length);
      const randomWidth = Math.floor(Math.random() * 200 + 300);
      const randomHeight = Math.floor(Math.random() * 200 + 300);
      return `${this.imageCollection[randomIndex]}?w=${randomWidth}&h=${randomHeight}&fit=crop`;
    },
    getRandomAvatar() {
      const randomIndex = Math.floor(Math.random() * this.avatarCollection.length);
      return `${this.avatarCollection[randomIndex]}?w=50&h=50&fit=crop`;
    },
    initData() {
      this.items = Array.from({ length: 20 }, (_, index) => ({
        id: index + 1,
        image: this.getRandomImage(),
        title: `标题 ${index + 1}`,
        description: `这是第 ${index + 1} 个卡片的描述文本，描述了一些有趣的内容...`,
        avatar: this.getRandomAvatar(),
        username: `用户${index + 1}`,
        likes: Math.floor(Math.random() * 1000)
      }));
      this.distributeItems();
    },
    distributeItems() {
      this.columns = Array.from({ length: this.columnCount }, () => [])
      this.items.forEach((item, index) => {
        const columnIndex = index % this.columnCount // 根据%取余数，得到结果为循环的0,1：将数据均匀分配到不同列中
        this.columns[columnIndex].push(item)
      })
    },
    handleCardClick(item) {
      console.log('点击了卡片:', item)
    },
    handleResize() {
      const width = window.innerWidth
      if (width <= 768) {
        this.columnCount = 2
      } else if (width <= 1024) {
        this.columnCount = 3
      } else {
        this.columnCount = 4
      }
      this.distributeItems()
    },
    handleImageError(e) {
      // 图片加载失败时替换为默认图片
      e.target.src = 'https://images.unsplash.com/photo-1682687220923-c58b9a4592ae?w=313&h=499&fit=crop';
    }
  },
  mounted() {
    this.initData()
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style scoped>
.waterfall-container {
  display: flex;
  padding: 10px;
  gap: 10px;
  max-width: 1200px;
  margin: 0 auto;
}

.waterfall-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s;
}

.card:hover {
  transform: translateY(-5px);
}

.card-image {
  width: 100%;
  position: relative;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: auto;
  display: block;
  transition: opacity 0.3s;
  opacity: 0;
}

.card-image img[src] {
  opacity: 1;
}

.card-content {
  padding: 12px;
}

.card-title {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
}

.card-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.username {
  font-size: 12px;
  color: #666;
}

.likes {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
}

.heart-icon {
  font-size: 14px;
}

@media screen and (max-width: 768px) {
  .waterfall-container {
    padding: 5px;
    gap: 5px;
  }
  
  .card-content {
    padding: 8px;
  }
  
  .card-title {
    font-size: 14px;
  }
  
  .card-description {
    font-size: 12px;
  }
}
</style> 