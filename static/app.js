Vue.component('checklist-item', {
    props: ['item', 'itemIndex'],
    data() {
      return {
        showPopup: false
      };
    },
    template: `
      <li class="list-group-item" :class="{ 'checked': item.checked }" @mouseover="showPopup = true" @mouseleave="showPopup = false">
        <span @click="toggleCollapse" class="collapse-icon" v-if="item.children.length > 0" :class="{ 'expand': !item.collapsed, 'collapse': item.collapsed }"></span>
        <span @click="toggleCheck" class="check-icon">{{ item.checked ? '\u2713' : '\u2714' }}</span>
        <span>{{ item.text }}</span>
        <span @click="deleteItem" class="text-danger">Delete</span>
        <div v-if="showPopup" class="popup-menu">
          <span @click="deleteItem">Delete</span>
        </div>
        <ul v-if="item.children.length > 0 && !item.collapsed" class="list-group mt-2">
          <checklist-item v-for="(childItem, index) in item.children" :key="index" :item="childItem" :itemIndex="index"></checklist-item>
        </ul>
      </li>
    `,
    methods: {
      toggleCheck() {
        this.item.checked = !this.item.checked;
        this.saveChecklistToLocalStorage();
      },
      toggleCollapse() {
        this.item.collapsed = !this.item.collapsed;
        this.saveChecklistToLocalStorage();
      },
      deleteItem() {
        const index = this.$parent.checklistData.indexOf(this.item);
        if (index !== -1) {
          this.$parent.checklistData.splice(index, 1);
          this.saveChecklistToLocalStorage();
        }
      },
      saveChecklistToLocalStorage() {
        localStorage.setItem('checklist', JSON.stringify(this.$parent.checklistData));
      }
    }
  });
  
  const app = new Vue({
    el: '#app',
    data: {
      newItemText: '',
      checklistData: JSON.parse(localStorage.getItem('checklist')) || []
    },
    methods: {
      addItem() {
        const trimmedText = this.newItemText.trim();
        if (trimmedText !== '') {
          this.createItem(trimmedText);
          this.newItemText = '';
        }
      },
      createItem(text, parent = null) {
        const newItem = {
          text,
          checked: false,
          collapsed: false,
          children: []
        };
  
        if (parent === null) {
          this.checklistData.push(newItem);
        } else {
          parent.children.push(newItem);
        }
  
        this.saveChecklistToLocalStorage();
      },
      saveChecklistToLocalStorage() {
        localStorage.setItem('checklist', JSON.stringify(this.checklistData));
      }
    },
    watch: {
      checklistData: {
        deep: true,
        handler() {
          this.saveChecklistToLocalStorage();
        }
      }
    },
    mounted() {
      const sortableList = this.$refs.sortableList;
      Sortable.create(sortableList, {
        animation: 150,
        onUpdate: (evt) => {
          const movedItem = this.checklistData.splice(evt.oldIndex, 1)[0];
          this.checklistData.splice(evt.newIndex, 0, movedItem);
        }
      });
    }
  });
  