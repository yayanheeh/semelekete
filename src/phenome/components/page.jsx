import Utils from '../utils/utils';
import Mixins from '../utils/mixins';

import F7PageContent from './page-content';

export default {
  name: 'f7-page',
  props: {
    id: [String, Number],
    className: String, // phenome-react-line
    style: Object, // phenome-react-line
    name: String,
    stacked: Boolean,
    withSubnavbar: {
      type: Boolean,
      default: undefined,
    },
    subnavbar: {
      type: Boolean,
      default: undefined,
    },
    noNavbar: Boolean,
    noToolbar: Boolean,
    tabs: Boolean,
    pageContent: {
      type: Boolean,
      default: true,
    },
    noSwipeback: Boolean,
    // Page Content Props
    ptr: Boolean,
    ptrDistance: Number,
    ptrPreloader: {
      type: Boolean,
      default: true,
    },
    infinite: Boolean,
    infiniteTop: Boolean,
    infiniteDistance: Number,
    infinitePreloader: {
      type: Boolean,
      default: true,
    },
    hideBarsOnScroll: Boolean,
    hideNavbarOnScroll: Boolean,
    hideToolbarOnScroll: Boolean,
    messagesContent: Boolean,
    loginScreen: Boolean,
    ...Mixins.colorProps,
  },
  state() {
    return {
      hasSubnavbar: false,
      routerClasses: '',
    };
  },
  render() {
    const self = this;
    const props = self.props;
    const {
      id,
      style,
      name,
      pageContent,
      messagesContent,
      ptr,
      ptrDistance,
      ptrPreloader,
      infinite,
      infiniteDistance,
      infinitePreloader,
      infiniteTop,
      hideBarsOnScroll,
      hideNavbarOnScroll,
      hideToolbarOnScroll,
      loginScreen,
      className,
      stacked,
      tabs,
      subnavbar,
      withSubnavbar,
      noNavbar,
      noToolbar,
      noSwipeback,
    } = props;
    const fixedList = [];
    const staticList = [];
    const needsPageContent = pageContent;

    const { static: slotsStatic, fixed: slotsFixed, default: slotsDefault } = self.slots;

    let fixedTags;
    // phenome-vue-next-line
    fixedTags = ('navbar toolbar tabbar subnavbar searchbar messagebar fab list-index').split(' ');
    // phenome-react-next-line
    fixedTags = ('navbar toolbar tabbar subnavbar searchbar messagebar fab list-index').split(' ').map(tagName => `f7-${tagName}`);

    let hasSubnavbar;
    let hasMessages;
    hasMessages = messagesContent; // phenome-react-line
    hasMessages = self.$options.propsData.messagesContent; // phenome-vue-line

    if (slotsDefault) {
      slotsDefault.forEach((child) => {
        if (typeof child === 'undefined') return;
        let isFixedTag = false;
        if (process.env.COMPILER === 'react') {
          const tag = child.type && (child.type.displayName || child.type.name);
          if (!tag) {
            if (needsPageContent) staticList.push(child);
            return;
          }
          if (tag === 'F7Subnavbar' || tag === 'f7-subnavbar') hasSubnavbar = true;
          if (typeof hasMessages === 'undefined' && (tag === 'F7Messages' || tag === 'f7-messages')) hasMessages = true;
          if (fixedTags.indexOf(tag) >= 0) {
            isFixedTag = true;
          }
        }
        if (process.env.COMPILER === 'vue') {
          const tag = child.tag;
          if (!tag) {
            if (needsPageContent) staticList.push(child);
            return;
          }
          if (tag.indexOf('subnavbar') >= 0) hasSubnavbar = true;
          if (typeof hasMessages === 'undefined' && tag.indexOf('messages') >= 0) hasMessages = true;
          for (let j = 0; j < fixedTags.length; j += 1) {
            if (tag.indexOf(fixedTags[j]) >= 0) {
              isFixedTag = true;
            }
          }
        }
        if (needsPageContent) {
          if (isFixedTag) fixedList.push(child);
          else staticList.push(child);
        }
      });
    }

    const forceSubnavbar = (typeof subnavbar === 'undefined' && typeof withSubnavbar === 'undefined')
      ? hasSubnavbar || this.state.hasSubnavbar
      : false;

    const classes = Utils.classNames(
      className,
      'page',
      this.state.routerClasses,
      {
        stacked,
        tabs,
        'page-with-subnavbar': subnavbar || withSubnavbar || forceSubnavbar,
        'no-navbar': noNavbar,
        'no-toolbar': noToolbar,
        'no-swipeback': noSwipeback,
      },
      Mixins.colorClasses(props),
    );

    if (!needsPageContent) {
      return (
        <div ref="el" id={id} style={style} className={classes} data-name={name}>
          {slotsFixed}
          {slotsStatic}
          {slotsDefault}
        </div>
      );
    }

    const pageContentEl = (
      <F7PageContent
        ptr={ptr}
        ptrDistance={ptrDistance}
        ptrPreloader={ptrPreloader}
        infinite={infinite}
        infiniteTop={infiniteTop}
        infiniteDistance={infiniteDistance}
        infinitePreloader={infinitePreloader}
        hideBarsOnScroll={hideBarsOnScroll}
        hideNavbarOnScroll={hideNavbarOnScroll}
        hideToolbarOnScroll={hideToolbarOnScroll}
        messagesContent={messagesContent || hasMessages}
        loginScreen={loginScreen}
      >
        {slotsStatic}
        {staticList}
      </F7PageContent>
    );

    return (
      <div ref="el" id={id} style={style} className={classes} data-name={name}>
        {fixedList}
        {slotsFixed}
        {pageContentEl}
      </div>
    );
  },
  componentDidMount() {
    const self = this;
    const el = self.refs.el;
    const { ptr, infinite } = self.props;

    self.onPtrPullStart = self.onPtrPullStart.bind(self);
    self.onPtrPullMove = self.onPtrPullMove.bind(self);
    self.onPtrPullEnd = self.onPtrPullEnd.bind(self);
    self.onPtrRefresh = self.onPtrRefresh.bind(self);
    self.onPtrDone = self.onPtrDone.bind(self);
    self.onInfinite = self.onInfinite.bind(self);
    self.onPageMounted = self.onPageMounted.bind(self);
    self.onPageInit = self.onPageInit.bind(self);
    self.onPageReinit = self.onPageReinit.bind(self);
    self.onPageBeforeIn = self.onPageBeforeIn.bind(self);
    self.onPageBeforeOut = self.onPageBeforeOut.bind(self);
    self.onPageAfterOut = self.onPageAfterOut.bind(self);
    self.onPageAfterIn = self.onPageAfterIn.bind(self);
    self.onPageBeforeRemove = self.onPageBeforeRemove.bind(self);

    if (ptr) {
      el.addEventListener('ptr:pullstart', self.onPtrPullStart);
      el.addEventListener('ptr:pullmove', self.onPtrPullMove);
      el.addEventListener('ptr:pullend', self.onPtrPullEnd);
      el.addEventListener('ptr:refresh', self.onPtrRefresh);
      el.addEventListener('ptr:done', self.onPtrDone);
    }
    if (infinite) {
      el.addEventListener('infinite', self.onInfinite);
    }
    el.addEventListener('page:mounted', self.onPageMounted);
    el.addEventListener('page:init', self.onPageInit);
    el.addEventListener('page:reinit', self.onPageReinit);
    el.addEventListener('page:beforein', self.onPageBeforeIn);
    el.addEventListener('page:beforeout', self.onPageBeforeOut);
    el.addEventListener('page:afterout', self.onPageAfterOut);
    el.addEventListener('page:afterin', self.onPageAfterIn);
    el.addEventListener('page:beforeremove', self.onPageBeforeRemove);
  },
  componentWillUnmount() {
    const self = this;
    const el = self.refs.el;

    el.removeEventListener('ptr:pullstart', self.onPtrPullStart);
    el.removeEventListener('ptr:pullmove', self.onPtrPullMove);
    el.removeEventListener('ptr:pullend', self.onPtrPullEnd);
    el.removeEventListener('ptr:refresh', self.onPtrRefresh);
    el.removeEventListener('ptr:done', self.onPtrDone);
    el.removeEventListener('infinite', self.onInfinite);
    el.removeEventListener('page:mounted', self.onPageMounted);
    el.removeEventListener('page:init', self.onPageInit);
    el.removeEventListener('page:reinit', self.onPageReinit);
    el.removeEventListener('page:beforein', self.onPageBeforeIn);
    el.removeEventListener('page:beforeout', self.onPageBeforeOut);
    el.removeEventListener('page:afterout', self.onPageAfterOut);
    el.removeEventListener('page:afterin', self.onPageAfterIn);
    el.removeEventListener('page:beforeremove', self.onPageBeforeRemove);
  },
  methods: {
    onPtrPullStart(event) {
      this.dispatchEvent('ptr:pullstart ptrPullStart', event);
    },
    onPtrPullMove(event) {
      this.dispatchEvent('ptr:pullmove ptrPullMove', event);
    },
    onPtrPullEnd(event) {
      this.dispatchEvent('ptr:pullend ptrPullEnd', event);
    },
    onPtrRefresh(event) {
      const done = event.detail;
      this.dispatchEvent('ptr:refresh ptrRefresh', event, done);
    },
    onPtrDone(event) {
      this.dispatchEvent('ptr:done ptrDone', event);
    },
    onInfinite(event) {
      this.dispatchEvent('infinite', event);
    },
    onPageMounted(event) {
      const page = event.detail;
      this.dispatchEvent('page:mounted pageMounted', event, page);
    },
    onPageInit(event) {
      const page = event.detail;
      const { withSubnavbar, subnavbar } = this.props;
      if (typeof withSubnavbar === 'undefined' && typeof subnavbar === 'undefined') {
        if (
          (page.$navbarEl && page.$navbarEl.length && page.$navbarEl.find('.subnavbar').length)
          || (page.$el.children('.navbar').find('.subnavbar').length)
        ) {
          this.setState({ hasSubnavbar: true });
        }
      }

      this.dispatchEvent('page:init pageInit', event, page);
    },
    onPageReinit(event) {
      const page = event.detail;
      this.dispatchEvent('page:reinit pageReinit', event, page);
    },
    onPageBeforeIn(event) {
      const page = event.detail;
      if (page.from === 'next') {
        this.setState({
          routerClasses: 'page-next',
        });
      }
      if (page.from === 'previous') {
        this.setState({
          routerClasses: 'page-previous',
        });
      }
      this.dispatchEvent('page:beforein pageBeforeIn', event, page);
    },
    onPageBeforeOut(event) {
      const page = event.detail;
      this.dispatchEvent('page:beforeout pageBeforeOut', event, page);
    },
    onPageAfterOut(event) {
      const page = event.detail;
      if (page.to === 'next') {
        this.setState({
          routerClasses: 'page-next',
        });
      }
      if (page.to === 'previous') {
        this.setState({
          routerClasses: 'page-previous',
        });
      }
      this.dispatchEvent('page:afterout pageAfterOut', event, page);
    },
    onPageAfterIn(event) {
      const page = event.detail;
      this.setState({
        routerClasses: 'page-current',
      });
      this.dispatchEvent('page:afterin pageAfterIn', event, page);
    },
    onPageBeforeRemove(event) {
      const page = event.detail;
      this.dispatchEvent('page:beforeremove pageBeforeRemove', event, page);
    },
  },
};
