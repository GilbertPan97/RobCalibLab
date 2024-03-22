<template>
  <div class="top-nav">
    <router-link to="/" class="nav-link">
      <img src="../assets/logo.png" alt="Logo" class="logo">
    </router-link>
    <router-link to="/Camera" class="nav-link">Camera</router-link>
    <router-link to="/CalibTool" class="nav-link">CalibTool</router-link>
  </div>
</template>

<script>
export default {
  name: 'TopNav',
};
</script>

<style scoped>
.top-nav {
  background-color: #333;
  padding: 10px;
}

.nav-link {
  color: white;
  margin-right: 20px;
  font-size: 18px;
  text-decoration: none;
}

.nav-link:hover {
  text-decoration: underline;
}

.logo {
  width: 60px;
  height: auto;
  margin-right: 10px;
}

.logo:hover {
  background-color: #5f5e5e; /* 鼠标悬停时改变背景颜色 */
  padding: 5px; /* 添加边框 */
  border-radius: 10px; /* 边框角落圆角 */
}
</style>
  