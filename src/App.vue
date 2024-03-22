<template>
  <div id="app">
    <TopNav />
    <div class="main-container">
      <MainView />
      <PropertiesPane />
    </div>
  </div>
</template>

<script>
import TopNav from './components/TopNav.vue';
import MainView from './components/MainView.vue';
import PropertiesPane from './components/PropertiesPanel.vue';

export default {
  name: 'App',
  components: {
    TopNav,
    MainView,
    PropertiesPane,
  },
};
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  text-align: center;
  height: 100vh; /* 设置 App.vue 的高度为视口高度 */
  display: flex;
  flex-direction: column;
}

.main-container {
  flex: 1; /* 设置 main-container 占满剩余空间 */
  display: flex;
}

.main-view, .properties-pane {
  border: 1px solid #ccc; /* 添加边框 */
}

.main-view {
  width: 70%;
}

.properties-pane {
  width: 30%;
}
</style>


./components/PropertiesPanel.vue