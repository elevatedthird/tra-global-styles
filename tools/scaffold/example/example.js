import once from "@drupal/once";

// non jquery version
Drupal.behaviors.ariesZcamelNameZ = {
  attach(context) {
    once('ZpathZ', context.querySelector('.ZtypeZ--ZpathZ')).forEach((el) => {
      // do things!
    });
  }
};

// jquery version
Drupal.behaviors.ariesZcamelNameZ = {
  attach(context) {
    $(context)
      .find('.ZtypeZ--ZpathZ')
      .once('ZpathZ')
      .each((index, el) => {
        // do stuffs
      });
  },
};
