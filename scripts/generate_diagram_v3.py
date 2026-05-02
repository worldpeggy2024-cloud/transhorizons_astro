import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

# Constants
ASPECT_RATIO = 16 / 9
WIDTH = 16
HEIGHT = 9
BG_COLOR = '#ECE7DD'  # Light beige/peach to match map tone
DARK_GREEN = '#1B3D18' # Dark green for arrows
BOX_FILL_LIGHT = '#EAEAEA'   # Light neutral fill
BOX_FILL_MEDIUM = '#DADADA' # Slightly darker for Resource Base
BOX_FILL_ACCENT = '#E0E0E0' # Slightly darker than standard light fill
DARKEST_GREY = '#1A1A1A' # For text
BOX_EDGE = '#B0B0B0'

fig, ax = plt.subplots(figsize=(WIDTH, HEIGHT), dpi=150)
fig.patch.set_facecolor(BG_COLOR)
ax.set_facecolor(BG_COLOR)

# Set limits and hide axes
ax.set_xlim(0, WIDTH)
ax.set_ylim(0, HEIGHT)
ax.axis('off')

# 1. TITLE (top)
plt.text(WIDTH/2, 8.45, "CANADA AS A RESOURCE CIVILIZATION",
         ha='center', va='center', fontsize=25, fontweight='semibold', color='#1f2937')
plt.text(WIDTH/2, 8.07, "Export-oriented resource system",
         ha='center', va='center', fontsize=13, color='#374151')

# 2. MAIN FLOW BLOCKS
box_width = 2.4
box_height = 1.4
y_main = 5.98
x_positions = [1.5, 4.75, 8.0, 11.25, 14.5]

blocks = [
    {"title": "Resource Base", "sub": "Natural resources\n(energy, minerals, forests)"},
    {"title": "Extraction", "sub": "Geographically dispersed,\ncapital-intensive"},
    {"title": "Transport\nInfrastructure", "sub": "Pipelines · Rail · Corridors"},
    {"title": "Export Gateways", "sub": "Ports · Border crossings"},
    {
        "title": "External Demand",
        "sub": "U.S. market (dominant)\nGlobal markets\nPrimary integration:\nU.S. system"
    }
]

for i, pos in enumerate(x_positions):
    if i == 0:
        fill = BOX_FILL_MEDIUM
    elif i in (2, 4):
        fill = BOX_FILL_ACCENT
    else:
        fill = BOX_FILL_LIGHT

    rect = patches.FancyBboxPatch((pos - box_width/2, y_main - box_height/2), box_width, box_height,
                                  boxstyle="round,pad=0.1", linewidth=1.2, edgecolor=BOX_EDGE, facecolor=fill)
    ax.add_patch(rect)

    title_y = y_main + 0.15
    sub_y = y_main - 0.25
    sub_fontsize = 11
    if i == 2:
        title_y = y_main + 0.23
    if i == 4:
        title_y = y_main + 0.23
        sub_y = y_main - 0.33
        sub_fontsize = 9.7

    plt.text(pos, title_y, blocks[i]["title"], ha='center', va='center', fontsize=14, fontweight='bold', color=DARKEST_GREY)
    plt.text(pos, sub_y, blocks[i]["sub"], ha='center', va='center', fontsize=sub_fontsize, color=DARKEST_GREY)

# Main Flow Arrows
for i in range(len(x_positions) - 1):
    start_x = x_positions[i] + box_width/2 + 0.1
    end_x = x_positions[i+1] - box_width/2 - 0.1
    ax.annotate('', xy=(end_x, y_main), xytext=(start_x, y_main),
                arrowprops=dict(facecolor=DARK_GREEN, edgecolor=DARK_GREEN, shrink=0.05, width=6, headwidth=15, headlength=15))

# 4. FEEDBACK LOOP (BOTTOM)
curve_x = [x_positions[4], (x_positions[4]+x_positions[1])/2, x_positions[1]]
curve_y = [y_main - box_height/2 - 0.1, 3.5, y_main - box_height/2 - 0.5]

path_data = [
    (patches.Path.MOVETO, [curve_x[0], curve_y[0]]),
    (patches.Path.CURVE4, [curve_x[0], 3.68]),
    (patches.Path.CURVE4, [curve_x[2], 3.68]),
    (patches.Path.CURVE4, [curve_x[2], curve_y[2]]),
]
codes, verts = zip(*path_data)
path = patches.Path(verts, codes)
patch = patches.PathPatch(path, facecolor='none', edgecolor=DARK_GREEN, linewidth=2.5, alpha=0.8)
ax.add_patch(patch)

ax.annotate('', xy=(x_positions[1], y_main - box_height/2 - 0.05),
            xytext=(x_positions[1], y_main - box_height/2 - 0.5),
            arrowprops=dict(arrowstyle="-|>,head_width=0.3,head_length=0.5", color=DARK_GREEN, lw=2.5, alpha=0.8))

# Loop Labels
plt.text((x_positions[4] + x_positions[1])/2, 2.62, "Investment & System Reinforcement",
         ha='center', va='top', fontsize=16, fontweight='bold', color=DARKEST_GREY)

# Small labels along loop
plt.text(x_positions[4] - 0.8, 3.42, "Investment", ha='center', va='center', fontsize=11, color=DARKEST_GREY)
plt.text((x_positions[4] + x_positions[1])/2, 3.42, "Infrastructure expansion", ha='center', va='center', fontsize=11, color=DARKEST_GREY)
plt.text(x_positions[1] + 0.8, 3.42, "Capacity development", ha='center', va='center', fontsize=11, color=DARKEST_GREY)

# 5. CONSTRAINT LAYER
constraint_width = 12
constraint_height = 0.8
y_const = 1.28
rect_const = patches.FancyBboxPatch((WIDTH/2 - constraint_width/2, y_const - constraint_height/2),
                                     constraint_width, constraint_height,
                                     boxstyle="round,pad=0.1", linewidth=0.8, edgecolor='#CCCCCC', facecolor='#E8E8E8')
ax.add_patch(rect_const)

plt.text(WIDTH/2, y_const + 0.15, "Structural Constraints", ha='center', va='center', fontsize=14, fontweight='bold', color=DARKEST_GREY)
plt.text(WIDTH/2, y_const - 0.15, "Regulation  ·  Geography  ·  Capital intensity  ·  Indigenous governance",
         ha='center', va='center', fontsize=12, color=DARKEST_GREY)

output_path = r'c:\Users\peggy\DevTest\transhorizons_astro\public\images\canada_resource_civilization_diagram.png'
os.makedirs(os.path.dirname(output_path), exist_ok=True)
plt.savefig(output_path, bbox_inches='tight', facecolor=BG_COLOR)
print(f'Saved diagram to: {output_path}')
