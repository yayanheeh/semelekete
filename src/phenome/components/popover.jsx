import Mixins from '../utils/mixins';
import Utils from '../utils/utils';

/* phenome-dts-imports
import { Popover as PopoverNamespace } from 'framework7/components/popover/popover';
*/

/* phenome-dts-instance
f7Popover: PopoverNamespace.Popover
*/

export default {
  name: 'f7-popover',
  props: {
    id: [String, Number],
    className: String, // phenome-react-line
    style: Object, // phenome-react-line
    opened: Boolean,
    target: [String, Object],
    closeByBackdropClick: Boolean,
    closeByOutsideClick: Boolean,
    ...Mixins.colorProps,
  },
  render() {
    const self = this;
    const props = self.props;
    const {
      className,
      id,
      style,
    } = props;
    const classes = Utils.classNames(
      className,
      'popover',
      Mixins.colorClasses(props),
    );
    return (
      <div
        ref="el"
        id={id}
        style={style}
        className={classes}
      >
        <div className="popover-angle" />
        <div className="popover-inner">
          <slot />
        </div>
      </div>
    );
  },
  watch: {
    'props.opened': function watchOpened(opened) {
      const self = this;
      if (!self.f7Popover) return;
      if (opened) {
        self.f7Popover.open();
      } else {
        self.f7Popover.close();
      }
    },
  },
  componentDidMount() {
    const self = this;

    const el = self.refs.el;
    if (!el) return;
    self.onOpenBound = self.onOpen.bind(self);
    self.onOpenedBound = self.onOpened.bind(self);
    self.onCloseBound = self.onClose.bind(self);
    self.onClosedBound = self.onClosed.bind(self);
    el.addEventListener('popover:open', self.onOpenBound);
    el.addEventListener('popover:opened', self.onOpenedBound);
    el.addEventListener('popover:close', self.onCloseBound);
    el.addEventListener('popover:closed', self.onClosedBound);

    const props = self.props;
    const {
      target,
      opened,
      closeByBackdropClick,
      closeByOutsideClick,
    } = props;

    const popoverParams = { el };
    if (target) popoverParams.targetEl = target;

    if (process.env.COMPILER === 'vue') {
      if (typeof self.$options.propsData.closeByBackdropClick !== 'undefined') popoverParams.closeByBackdropClick = closeByBackdropClick;
      if (typeof self.$options.propsData.closeByOutsideClick !== 'undefined') popoverParams.closeByOutsideClick = closeByOutsideClick;
    }
    if (process.env.COMPILER === 'react') {
      if ('closeByBackdropClick' in props) popoverParams.closeByBackdropClick = closeByBackdropClick;
      if ('closeByOutsideClick' in props) popoverParams.closeByOutsideClick = closeByOutsideClick;
    }

    self.$f7ready(() => {
      self.f7Popover = self.$f7.popover.create(popoverParams);

      if (opened && target) {
        self.f7Popover.open(target, false);
      }
    });
  },
  componentWillUnmount() {
    const self = this;
    if (self.f7Popover) self.f7Popover.destroy();
    const el = self.refs.el;
    if (!el) return;
    el.removeEventListener('popover:open', self.onOpenBound);
    el.removeEventListener('popover:opened', self.onOpenedBound);
    el.removeEventListener('popover:close', self.onCloseBound);
    el.removeEventListener('popover:closed', self.onClosedBound);
  },
  methods: {
    onOpen(event) {
      this.dispatchEvent('popover:open popoverOpen', event);
    },
    onOpened(event) {
      this.dispatchEvent('popover:opened popoverOpened', event);
    },
    onClose(event) {
      this.dispatchEvent('popover:close popoverClose', event);
    },
    onClosed(event) {
      this.dispatchEvent('popover:closed popoverClosed', event);
    },
    open(target, animate) {
      const self = this;
      if (!self.$f7) return undefined;
      return self.$f7.popover.open(self.refs.el, target, animate);
    },
    close(animate) {
      const self = this;
      if (!self.$f7) return undefined;
      return self.$f7.sheet.close(self.refs.el, animate);
    },
  },
};
