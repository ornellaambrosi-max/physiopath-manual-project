import React, { useState, useId, useMemo } from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Accordion
 * - type: "single" | "multiple"
 * - defaultValue: string | string[]
 * - value/onValueChange (controllato)
 * - items: [{ value, title, content }] (opzionale se non si usano i children)
 *
 * Uso 1 (dichiarativo):
 * <Accordion type="single" defaultValue="a" items={[
 *   { value: "a", title: "Titolo A", content: <div>Contenuto A</div> }
 * ]} />
 *
 * Uso 2 (children):
 * <Accordion type="multiple">
 *   <AccordionItem value="x" title="Sezione X">Contenuto X</AccordionItem>
 * </Accordion>
 */

export function Accordion({
  type = "single",
  defaultValue,
  value,
  onValueChange,
  items,
  className,
  children,
  ...props
}) {
  const controlled = value !== undefined;
  const [internal, setInternal] = useState(
    type === "multiple"
      ? Array.isArray(defaultValue) ? defaultValue : []
      : (defaultValue ?? null)
  );

  const current = controlled ? value : internal;

  const toggle = (val) => {
    if (type === "multiple") {
      const arr = Array.isArray(current) ? current.slice() : [];
      const idx = arr.indexOf(val);
      if (idx >= 0) arr.splice(idx, 1);
      else arr.push(val);
      controlled ? onValueChange?.(arr) : setInternal(arr);
    } else {
      const next = current === val ? null : val;
      controlled ? onValueChange?.(next) : setInternal(next);
    }
  };

  const content = useMemo(() => {
    if (items?.length) {
      return items.map((it) => (
        <AccordionItem
          key={it.value}
          value={it.value}
          title={it.title}
          open={
            type === "multiple"
              ? Array.isArray(current) && current.includes(it.value)
              : current === it.value
          }
          onToggle={() => toggle(it.value)}
        >
          {it.content}
        </AccordionItem>
      ));
    }
    // children mode: clona i children e passa props
    return React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child;
      const val = child.props.value;
      const open =
        type === "multiple"
          ? Array.isArray(current) && current.includes(val)
          : current === val;
      return React.cloneElement(child, {
        open,
        onToggle: () => toggle(val),
      });
    });
  }, [items, children, current, type]);

  return (
    <div className={cn("w-full divide-y rounded-md border", className)} {...props}>
      {content}
    </div>
  );
}

export function AccordionItem({
  value, // usato solo in modalità children
  title,
  open: openProp,
  onToggle,
  children,
  className,
}) {
  const id = useId();
  const open = !!openProp;

  return (
    <div className={cn("group", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-content`}
        onClick={onToggle}
        className={cn(
          "flex w-full items-center justify-between gap-3 bg-gray-50 px-4 py-3 text-left",
          "hover:bg-gray-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        )}
      >
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {title}
        </span>
        <svg
          className={cn(
            "h-4 w-4 transition-transform",
            open ? "rotate-180" : "rotate-0"
          )}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.19l3.71-2.96a.75.75 0 0 1 .94 1.16l-4.24 3.39a.75.75 0 0 1-.94 0L5.21 8.39a.75.75 0 0 1 .02-1.18z" />
        </svg>
      </button>

      <div
        id={`${id}-content`}
        hidden={!open}
        className={cn(
          "px-4 py-3 text-sm text-gray-700 dark:text-gray-200"
        )}
      >
        {children}
      </div>
    </div>
  );
}
