<template>
  <div class="home-container">
    <div class="header">
      <h1 class="title">一个普普通通的前端的个人网站</h1>
      <p class="subtitle">努力工作还贷，再也不当韭菜</p>
    </div>

    <div class="article-list">
      <div v-for="article in menuOptions" :key="article.index">
        <template v-if="article.children && article.children.length > 0">
          <div v-for="item in article.children" :key="item.index" class="article-item">
            <div class="article-content" @click="handleClick(item)">
              <h2 class="article-title">{{ item.menuName }}</h2>
              <div class="article-meta">
                <span class="author">
                  <i class="el-icon-user"></i>
                  {{ item.author }}
                </span>
                <span class="date">
                  <i class="el-icon-date"></i>
                  {{ item.date }}
                </span>
                <span v-if="item.tag" class="tag">
                  <i class="el-icon-collection-tag"></i>
                  {{ item.tag }}
                </span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="sidebar">
      <div class="profile-card">
        <img class="avatar" src="https://jrit-zl-test-1302914566.cos.ap-guangzhou.myqcloud.com/sit/2023-10-19/1697698956763-%E5%A4%A7%E9%9B%84.png" alt="头像">
        <h3 class="name">ChrisZhang</h3>
        <div class="stats">
          <template v-for="item in menuOptions">
            <div v-if="item.children && item.children.length" class="stat-item" :key="item.index">
              <div class="number">{{ item.children.length }}</div>
              <div class="label">{{ item.menuName }}</div>
            </div>
          </template>
        </div>
      </div>

      <div class="categories-card">
        <h3 class="card-title">Categories</h3>
        <div class="category-list">
          <div class="category-item">
            <span class="category-name">前端</span>
            <span class="category-count">1</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { menuOptions } from '@/staticData'
export default {
  name: 'Home',
  data() {
    return {
      menuOptions,
      articles: [
        {
          id: 1,
          title: '拖放排序插件Sortable.js',
          author: 'ChrisZhang',
          date: '11/10/2023',
          tag: '插件'
        },
        {
          id: 2,
          title: 'vuepress-theme-reco',
          author: 'ChrisZhang',
          date: '4/9/2019'
        },
        {
          id: 3,
          title: 'second page in category2',
          author: 'ChrisZhang',
          date: '9/21/2017',
          tag: 'tag4'
        }
      ]
    }
  },
  methods: {
    handleClick(item) {
      this.$router.push(item.route)
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 30px;
}

.header {
  grid-column: 1 / -1;
  text-align: center;
  margin-bottom: 40px;

  .title {
    font-size: 2em;
    color: #2c3e50;
    margin-bottom: 10px;
  }

  .subtitle {
    color: #666;
    font-size: 1.2em;
  }
}

.article-list {
  .article-item {
    background: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
    transition: transform 0.3s;

    &:hover {
      transform: translateY(-3px);
    }

    .article-title {
      color: #2c3e50;
      margin: 0 0 15px 0;
      font-size: 1.4em;

      &:hover {
        color: #42b983;
      }
    }

    .article-meta {
      color: #666;
      font-size: 0.9em;
      display: flex;
      gap: 20px;

      span {
        display: flex;
        align-items: center;
        gap: 5px;
      }

      i {
        font-size: 1.1em;
      }
    }
  }
}

.sidebar {
  .profile-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
    margin-bottom: 20px;

    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      margin-bottom: 15px;
    }

    .name {
      color: #2c3e50;
      margin-bottom: 20px;
    }

    .stats {
      display: flex;
      justify-content: center;
      gap: 30px;

      .stat-item {
        .number {
          font-size: 1.5em;
          color: #42b983;
          font-weight: bold;
        }

        .label {
          color: #666;
          font-size: 0.9em;
        }
      }
    }
  }

  .categories-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);

    .card-title {
      color: #2c3e50;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .category-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      color: #666;

      &:hover {
        color: #42b983;
      }

      .category-count {
        background: #f0f0f0;
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 0.9em;
      }
    }
  }
}

@media (max-width: 768px) {
  .home-container {
    grid-template-columns: 1fr;
  }

  .sidebar {
    order: -1;
  }
}
</style>
