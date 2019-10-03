<template>
  <button
    class="absolute w-8 h-8 top-0 left-0 mt-min ml-min rounded-full shadow-md hover:shadow-lg drag-none text-blue-700 hover:text-blue-600 active:text-blue-500 transition flex justify-center items-center"
  >
    <vue-svg-gauge
      :start-angle="0"
      :end-angle="360"
      :min="0"
      :max="1"
      :value="value ? 1 : 0.0001"
      gauge-color="currentColor"
      base-color="#BEE3F8"
      :scale-interval="0"
      :separator-step="0"
      :inner-radius="0"
      easing="Linear.None"
      :transition-duration="duration"
    />
    <div
      class="absolute inset-0 flex justify-center items-center text-white"
      @click="knock"
      @mouseenter="hovering = true"
      @mouseleave="hovering = false"
    >
      <i class="fas fa-bullhorn opacity-75" />
    </div>
  </button>
</template>

<script>
const ffi = require("ffi");

// This is entirely untested, and cobbled together from a couple of StackOverflow posts.
var user32 = new ffi.Library("user32", {
  FindWindowA: ["long", ["string", "string"]], // https://docs.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-findwindowa
  PostMessageA: ["int32", ["long", "int32", "long", "int32"]] // https://docs.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-postmessagea
});

const WM_KEYDOWN = 0x0100; // https://docs.microsoft.com/en-au/windows/win32/inputdev/wm-keydown
const WM_KEYUP = 0x0101; // https://docs.microsoft.com/en-au/windows/win32/inputdev/wm-keyup
const VK_F1 = 0x70; // https://docs.microsoft.com/en-au/windows/win32/inputdev/virtual-key-codes

export default {
  name: "Knocker",
  data() {
    return {
      value: true,
      timeout: null,
      hovering: false
    };
  },
  computed: {
    duration() {
      if (this.timeout) {
        return 4000;
      } else {
        return 100;
      }
    }
  },
  methods: {
    knock() {
      if (this.value) {
        this.timeout = setTimeout(() => {
          this.endKnock();
        }, 4000);
        this.value = false;
        this.$emit("knock");

        // FIXME: Make this a separate function that gets triggered by the emit()
        // FIXME: There is no error handling here at all. What happens if steamvr_knockknock can't be found?
        var steamvr_knockknock = user32.FindWindowA(NULL, "Want my attention?");
        user32.PostMessageA(steamvr_knockknock, WM_KEYDOWN, VK_F1, 0);
        user32.PostMessageA(steamvr_knockknock, WM_KEYUP, VK_F1, 0);
      }
    },
    endKnock() {
      clearTimeout(this.timeout);
      this.timeout = null;
      this.value = true;
    }
  }
};
</script>
