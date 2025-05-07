<template>
  <el-container class="nav-bar">
    <el-header>
      <div class="logo">
        <span class="text-2xl font-bold text-gray-800">🏭 钢铁智能问答</span>
      </div>
      <el-menu
        mode="horizontal"
        :router="true"
        :default-active="activeRouteName"
        class="nav-menu"
      >
        <el-menu-item index="/">
          首页
        </el-menu-item>
        <el-menu-item index="/qa">
          智能问答
        </el-menu-item>
        <!-- 预留扩展项 -->
        <el-menu-item index="/sphase">
          相图计算
        </el-menu-item>
      </el-menu>
    </el-header>
  </el-container>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue'; // 从 vue 模块导入 computed

const route = useRoute();
const activeRouteName = computed(() => route.path);
</script>

<style scoped>
.nav-bar {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  padding: 0 24px;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.logo {
  font-size: 1.25rem;
  font-weight: 600;
}

.nav-menu {
  margin-right: 24px;
}

.el-menu-item {
  margin-left: 24px;
  font-size: 0.95rem;
  color: #333;
}

.el-menu-item.is-active {
  color: #13ce66;
  font-weight: 500;
}
</style>
