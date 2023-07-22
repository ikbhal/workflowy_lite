Vue.component('checklist-item', {
  props: ['item'],
  data() {
    return {
      showSubMenu: false,
      newItemText: '',
      sublistCollapsed: false // New data property to track sublist collapse state
    };
  },
  template: `
    <li class="list-group-item">
      <span @click="toggleCollapse" class="collapse-icon" v-if="item.children.length > 0" :class="{ 'expand': !item.collapsed, 'collapse': item.collapsed }"></span>
      <span>{{ item.text }}</span>
      <span @click="deleteItem" class="text-danger">Delete</span>
      <span @click="toggleSubMenu" class="add-sublist-icon" v-if="!item.collapsed && item.children.length === 0">+</span>
      <div v-if="showSubMenu" class="sublist-input">
        <input v-model="newItemText" @keyup.enter="addSublistItem" type="text" class="form-control" placeholder="Add new item">
        <button @click="addSublistItem" class="btn btn-primary btn-sm">Add</button>
      </div>
      <span v-if="item.children.length > 0" @click="toggleSublistCollapse" class="sublist-collapse-icon" :class="{ 'sublist-expand': !sublistCollapsed, 'sublist-collapse': sublistCollapsed }"></span>
      <ul v-if="item.children.length > 0 && (!item.collapsed || !sublistCollapsed)" class="list-group mt-2">
        <checklist-item v-for="(childItem, index) in item.children" :key="index" :item="childItem"></checklist-item>
      </ul>
    </li>
  `,
  methods: {
    toggleCollapse() {
      this.item.collapsed = !this.item.collapsed;
    },
    toggleSubMenu() {
      this.showSubMenu = !this.showSubMenu;
    },
    deleteItem() {
      const index = this.$parent.checklistData.indexOf(this.item);
      if (index !== -1) {
        this.$parent.checklistData.splice(index, 1);
      }
    },
    addSublistItem() {
      const trimmedText = this.newItemText.trim();
      if (trimmedText !== '') {
        this.item.children.push({
          text: trimmedText,
          children: [],
          collapsed: false
        });
        this.newItemText = '';
      }
    },
    toggleSublistCollapse() {
      this.sublistCollapsed = !this.sublistCollapsed;
    }
  }
});

const app = new Vue({
  el: '#app',
  data: {
    newItemText: '',
    checklistData: []
  },
  methods: {
    addItem() {
      const trimmedText = this.newItemText.trim();
      if (trimmedText !== '') {
        this.checklistData.push({
          text: trimmedText,
          children: [],
          collapsed: false
        });
        this.newItemText = '';
      }
    }
  },
  mounted() {
    // Listen for the Enter key press event on the input element
    const inputElement = document.getElementById('newItemInput');
    inputElement.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        this.addItem();
      }
    });
  }
});