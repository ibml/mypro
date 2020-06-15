<template>
  <div id="v-widget">
    <v-card v-bind="$attrs" :class="cardClass" :style="custStyle">
      <v-toolbar color="transparent" flat dense card v-if="enableHeader">
        <v-toolbar-title>
          <h4>{{title}}</h4>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <slot name="widget-header-action"></slot>
      </v-toolbar>
      <v-divider v-if="enableHeader"></v-divider>
      <v-card-text :class="contentBg">
        <slot name="widget-content"></slot>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  export default {
    name: 'v-widget',
    inheritAttrs: false,
    props: {
      title: {
        type: String,
      },
      enableHeader: {
        type: Boolean,
        default: true
      },
      contentBg: {
        type: String,
        default: 'white'
      },
      custClass: {
        type: [String, Array],
        required: false,
        default: ''
      },
      custStyle: {
        type: Object,
        required: false,
      }
    },
    computed: {
      cardClass() {
        var _class = this.custClass;
        if (typeof _class === 'string') {
          return [_class]
        } else if (typeof _class === 'array') {
          return [..._class]
        } else {
          return []
        }
      }
    },

    data() {
      return {

      };
    },
  };
</script>