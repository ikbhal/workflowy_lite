Vue.component('checklist-item', {
  props: ['item'],
  data() {
    return {
      showSubMenu: false,
      newItemText: '',
      sublistCollapsed: false,
      showNewItemText: false
    };
  },
  template: `
    <li class="list-group-item">
      <span v-if="item.children.length > 0" 
        @click="toggleCollapse"
         class="sublist-collapse-icon"
        :class="{ 'sublist-expand': !sublistCollapsed, 'sublist-collapse': sublistCollapsed }"></span>
      <span>{{ item.text }}</span>
      <span @click="toggleSubMenu" class="add-sublist-icon" v-if="!item.collapsed && item.children.length === 0">+</span>
      <div v-if="showNewItemText" class="sublist-input">
        <input v-model="newItemText" @keyup.enter="addSublistItem" type="text" class="form-control" placeholder="Add new item">
      </div>
      
      <ul v-if="item.children.length > 0 && (!item.collapsed || !sublistCollapsed)" class="list-group mt-2">
        <checklist-item v-for="(childItem, index) in item.children" :key="index" :item="childItem"></checklist-item>
      </ul>
    </li>
  `,
  methods: {
    // toggleCollapse() {
    //   this.item.collapsed = !this.item.collapsed;
    // },
    toggleSubMenu() {
      this.showSubMenu = !this.showSubMenu;
      if (this.showSubMenu) {
        this.$nextTick(() => {
          this.$refs.addInput.focus();
        });
      }
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
    toggleCollapse() {
      this.sublistCollapsed = !this.sublistCollapsed;
      this.item.collapsed = !this.item.collapsed;
    },
    toggleInput() {
      this.showNewItemText = !this.showNewItemText;
    }
  }
});

const app = new Vue({
  el: '#app',
  data: {
    newItemText: '',
    checklistData: [],
    showAddInput: false
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
    const inputElement = document.getElementById('newItemInput');
    inputElement.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        this.addItem();
      }
    });
  }
});
