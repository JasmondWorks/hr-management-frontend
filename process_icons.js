const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, 'src', 'shared', 'ui', 'icons');
let files = fs.readdirSync(iconsDir).filter(f => f.endsWith('.tsx') && f !== 'index.ts');

// Rename files matching export function Name
for (const file of files) {
  const filePath = path.join(iconsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  const match = content.match(/export function ([A-Za-z0-9_]+)/);
  if (match) {
    const funcName = match[1];
    if (file !== `${funcName}.tsx`) {
      const newPath = path.join(iconsDir, `${funcName}.tsx`);
      fs.renameSync(filePath, newPath);
      console.log(`Renamed ${file} to ${funcName}.tsx`);
    }
  }
}

// Re-read after renaming
files = fs.readdirSync(iconsDir).filter(f => f.endsWith('.tsx') && f !== 'index.ts');

const camelCaseProps = {
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-miterlimit': 'strokeMiterlimit',
  'fill-rule': 'fillRule',
  'clip-rule': 'clipRule',
};

let exportsList = [];

for (const file of files) {
  const filePath = path.join(iconsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const componentName = path.basename(file, '.tsx');
  exportsList.push(`export { ${componentName} } from "./${componentName}";`);

  // Fix SVG props
  for (const [hyphen, camel] of Object.entries(camelCaseProps)) {
    const regex = new RegExp(hyphen + '=', 'g');
    content = content.replace(regex, camel + '=');
  }

  // Replace white with currentColor
  if (componentName !== 'BrandLogo') {
    content = content.replace(/stroke="white"/g, 'stroke="currentColor"');
    content = content.replace(/fill="white"/g, 'fill="currentColor"');
  }

  // Inject IconProps and variant
  if (!content.includes('interface IconProps')) {
    content = content.replace(
      /export function ([A-Za-z0-9_]+)\(\{\s*className,?\s*\.\.\.props\s*\}\s*:\s*React\.SVGProps<SVGSVGElement>\)\s*\{/,
      `export interface IconProps extends React.SVGProps<SVGSVGElement> {\n  variant?: "outline" | "filled";\n}\n\nexport function $1({ className, variant = "outline", ...props }: IconProps) {`
    );
  }

  // Inject className={className} {...props}
  if (!content.includes('className={className}')) {
    content = content.replace(/xmlns="http:\/\/www.w3.org\/2000\/svg"/, 'xmlns="http://www.w3.org/2000/svg"\n      className={className}\n      {...props}');
  }

  // Fill logic
  if (componentName !== 'BrandLogo') {
    if (!content.includes('variant === "filled"')) {
      content = content.replace(/<(path|circle|ellipse|rect|polygon|line)([^>]*?)>/g, (match, tag, attrs) => {
        // Skip if it already has a non-none fill
        if (attrs.includes('fill=') && !attrs.includes('fill="none"')) {
           return match; 
        }
        
        let newAttrs = attrs.replace(/\s*fill="none"\s*/, ' ');
        
        if (newAttrs.includes('stroke=')) {
           const strokeMatch = newAttrs.match(/stroke="([^"]+)"/);
           const strokeColor = strokeMatch ? strokeMatch[1] : "currentColor";
           return `<${tag} fill={variant === "filled" ? "${strokeColor}" : "none"}${newAttrs}>`;
        }
        
        return `<${tag}${attrs}>`;
      });
    }
  }

  fs.writeFileSync(filePath, content);
}

fs.writeFileSync(path.join(iconsDir, 'index.ts'), exportsList.sort().join('\n') + '\n');
console.log('Icons processed successfully');
