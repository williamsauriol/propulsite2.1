"""
SPÉCIMEN 02 — construction de la maison
────────────────────────────────────────────────────────────────────────────
À lancer dans Blender : onglet Scripting → Ouvrir → ce fichier → Run Script.
Le script efface la scène et reconstruit tout : on peut le relancer autant de
fois qu'on veut après avoir modifié les mesures en haut.

Maison ORIGINALE. On ne reprend d'une maison réelle que des caractéristiques
générales (deux étages, pierre, contemporain, plan ouvert, très lumineux).
Le plan, la volumétrie, le toit et la fenestration sont inventés — le but est
justement de ne pas être reconnaissable.

Parcours de caméra en 9 étapes, dans l'ordre du défilement du site :
  00 exterieur · 01 entree · 02 salon · 03 cuisine · 04 salle-de-bain
  05 chambre · 06 bureau · 07 cour · 08 aerien
"""

import bpy
import math
from mathutils import Vector

# ── Mesures (en mètres) ────────────────────────────────────────────────────
# Tout part d'ici : changer une valeur et relancer le script suffit.
LARGEUR      = 14.0   # façade avant, axe X
PROFONDEUR   = 10.0   # axe Y
H_ETAGE      = 3.0    # hauteur sous plafond
EP_MUR       = 0.25
DEBORD_TOIT  = 0.9

# Le volume est en L : une aile arrière décalée, pour casser la boîte
# rectangulaire et donner une cour intérieure au fond.
AILE_LARGEUR = 5.5
AILE_PROF    = 4.0

PORTE_L, PORTE_H = 1.5, 2.4
FEN_H            = 1.9    # hauteur des grandes baies
FEN_APPUI        = 0.85   # hauteur d'appui


# ── Utilitaires ────────────────────────────────────────────────────────────

def vider_scene():
    """Repart d'une scène propre, y compris les données orphelines."""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for bloc in (bpy.data.meshes, bpy.data.materials, bpy.data.cameras,
                 bpy.data.lights, bpy.data.curves):
        for item in list(bloc):
            if item.users == 0:
                bloc.remove(item)


def matiere(nom, couleur, rugosite=0.6, metal=0.0):
    """Matériau Principled simple. Réutilisé s'il existe déjà."""
    if nom in bpy.data.materials:
        return bpy.data.materials[nom]
    mat = bpy.data.materials.new(nom)
    mat.use_nodes = True
    p = mat.node_tree.nodes['Principled BSDF']
    p.inputs['Base Color'].default_value = (*couleur, 1.0)
    p.inputs['Roughness'].default_value = rugosite
    p.inputs['Metallic'].default_value = metal
    return mat


def boite(nom, centre, dims, mat=None, parent=None):
    """Cube redimensionné par ses dimensions réelles, pas par un facteur."""
    bpy.ops.mesh.primitive_cube_add(size=1, location=centre)
    o = bpy.context.active_object
    o.name = nom
    o.scale = Vector(dims)
    bpy.ops.object.transform_apply(scale=True)
    if mat:
        o.data.materials.append(mat)
    if parent:
        o.parent = parent
    return o


def mur_avec_ouvertures(nom, p1, p2, hauteur, epaisseur, ouvertures, mat, parent):
    """
    Construit un mur entre deux points, en le découpant AUTOUR des ouvertures
    plutôt qu'en perçant des trous.

    Les opérations booléennes en script sont fragiles : une géométrie non
    manifold suffit à les faire échouer silencieusement. Empiler des blocs
    pleins donne toujours un résultat propre et léger.

    ouvertures : liste de (position_le_long_du_mur, largeur, bas, haut)
    """
    ax, ay = p1
    bx, by = p2
    longueur = math.dist(p1, p2)
    angle = math.atan2(by - ay, bx - ax)
    milieu = ((ax + bx) / 2, (ay + by) / 2)

    segments = []          # (debut, fin, bas, haut) le long du mur
    ouvertures = sorted(ouvertures, key=lambda o: o[0])
    curseur = 0.0
    for (pos, larg, bas, haut) in ouvertures:
        d, f = pos - larg / 2, pos + larg / 2
        if d > curseur:
            segments.append((curseur, d, 0.0, hauteur))     # trumeau plein
        if bas > 0:
            segments.append((d, f, 0.0, bas))               # allège
        if haut < hauteur:
            segments.append((d, f, haut, hauteur))          # linteau
        curseur = f
    if curseur < longueur:
        segments.append((curseur, longueur, 0.0, hauteur))

    blocs = []
    for i, (d, f, bas, haut) in enumerate(segments):
        if f - d < 1e-4 or haut - bas < 1e-4:
            continue
        # position locale le long du mur, puis rotation autour du milieu
        local = (d + f) / 2 - longueur / 2
        cx = milieu[0] + math.cos(angle) * local
        cy = milieu[1] + math.sin(angle) * local
        b = boite(f"{nom}_{i}", (cx, cy, (bas + haut) / 2),
                  (f - d, epaisseur, haut - bas), mat, parent)
        b.rotation_euler.z = angle
        blocs.append(b)
    return blocs


# ── Construction ───────────────────────────────────────────────────────────

vider_scene()

M_PIERRE  = matiere('Pierre',    (0.52, 0.50, 0.47), 0.85)
M_BOIS    = matiere('BoisFonce', (0.15, 0.11, 0.08), 0.65)
M_BLANC   = matiere('MurBlanc',  (0.88, 0.87, 0.84), 0.90)
M_PLANCHER= matiere('Chene',     (0.42, 0.30, 0.18), 0.55)
M_NOIR    = matiere('CadreNoir', (0.05, 0.05, 0.05), 0.35, 0.6)
M_TOIT    = matiere('Toit',      (0.10, 0.10, 0.11), 0.75)
M_TERRAIN = matiere('Terrain',   (0.18, 0.22, 0.13), 0.95)
M_VITRE   = matiere('Vitre',     (0.55, 0.68, 0.75), 0.05)
M_VITRE.blend_method = 'BLEND'
M_VITRE.node_tree.nodes['Principled BSDF'].inputs['Alpha'].default_value = 0.22

racine = bpy.data.objects.new('SPECIMEN_02', None)
bpy.context.collection.objects.link(racine)

demi_l, demi_p = LARGEUR / 2, PROFONDEUR / 2

# Terrain
boite('Terrain', (0, 0, -0.1), (60, 60, 0.2), M_TERRAIN, racine)

# Dalles de plancher : rez-de-chaussée et étage
for etage in (0, 1):
    z = etage * H_ETAGE
    boite(f'Plancher_{etage}', (0, 0, z + 0.05), (LARGEUR, PROFONDEUR, 0.1),
          M_PLANCHER, racine)

# Enveloppe : deux étages.
# Rez : grande baie sur le salon (gauche), porte d'entrée au centre.
# Étage : fenêtres de chambre et de bureau.
for etage in (0, 1):
    z = etage * H_ETAGE
    base = bpy.data.objects.new(f'Etage_{etage}', None)
    bpy.context.collection.objects.link(base)
    base.parent = racine
    base.location.z = z

    mat_ext = M_PIERRE if etage == 0 else M_BOIS

    if etage == 0:
        ouv_avant = [(4.2, 3.4, FEN_APPUI, FEN_APPUI + FEN_H),   # baie du salon
                     (8.6, PORTE_L, 0.0, PORTE_H)]              # porte d'entrée
        ouv_arriere = [(4.0, 4.2, FEN_APPUI, FEN_APPUI + FEN_H), # cuisine
                       (10.5, 1.6, FEN_APPUI, FEN_APPUI + 1.2)]  # salle de bain
    else:
        ouv_avant = [(3.6, 2.6, FEN_APPUI, FEN_APPUI + FEN_H),   # chambre
                     (10.0, 2.2, FEN_APPUI, FEN_APPUI + FEN_H)]  # bureau
        ouv_arriere = [(7.0, 3.0, FEN_APPUI, FEN_APPUI + FEN_H)]

    mur_avec_ouvertures('MurAvant', (-demi_l, -demi_p), (demi_l, -demi_p),
                        H_ETAGE, EP_MUR, ouv_avant, mat_ext, base)
    mur_avec_ouvertures('MurArriere', (-demi_l, demi_p), (demi_l, demi_p),
                        H_ETAGE, EP_MUR, ouv_arriere, mat_ext, base)
    mur_avec_ouvertures('MurGauche', (-demi_l, -demi_p), (-demi_l, demi_p),
                        H_ETAGE, EP_MUR,
                        [(5.0, 2.4, FEN_APPUI, FEN_APPUI + FEN_H)], mat_ext, base)
    mur_avec_ouvertures('MurDroit', (demi_l, -demi_p), (demi_l, demi_p),
                        H_ETAGE, EP_MUR, [], mat_ext, base)

# Cloisons du rez-de-chaussée : entrée centrale, salon à gauche,
# cuisine au fond, salle de bain au fond à droite.
cloisons = bpy.data.objects.new('Cloisons_RDC', None)
bpy.context.collection.objects.link(cloisons)
cloisons.parent = racine

mur_avec_ouvertures('C_EntreeSalon', (1.4, -demi_p), (1.4, 1.0),
                    H_ETAGE, 0.14, [(4.5, 2.6, 0.0, 2.4)], M_BLANC, cloisons)
mur_avec_ouvertures('C_Cuisine', (-demi_l, 1.0), (3.2, 1.0),
                    H_ETAGE, 0.14, [(6.0, 3.2, 0.0, 2.4)], M_BLANC, cloisons)
mur_avec_ouvertures('C_Bain', (3.2, 1.0), (3.2, demi_p),
                    H_ETAGE, 0.14, [(2.0, 0.9, 0.0, 2.1)], M_BLANC, cloisons)

# Cloisons de l'étage : chambre à l'avant, bureau à l'arrière.
cloisons_h = bpy.data.objects.new('Cloisons_Etage', None)
bpy.context.collection.objects.link(cloisons_h)
cloisons_h.parent = racine
cloisons_h.location.z = H_ETAGE
mur_avec_ouvertures('C_ChambreBureau', (-demi_l, 0.5), (demi_l, 0.5),
                    H_ETAGE, 0.14, [(5.5, 1.1, 0.0, 2.2)], M_BLANC, cloisons_h)

# Toit plat à faible débord — volontairement différent d'un toit à pignon
# en bardeaux, pour ne pas rappeler la maison de référence.
boite('Toit', (0, 0, H_ETAGE * 2 + 0.15),
      (LARGEUR + DEBORD_TOIT * 2, PROFONDEUR + DEBORD_TOIT * 2, 0.3), M_TOIT, racine)

# Aile arrière : casse le volume et crée la cour.
boite('Aile', (demi_l - AILE_LARGEUR / 2, demi_p + AILE_PROF / 2, H_ETAGE / 2),
      (AILE_LARGEUR, AILE_PROF, H_ETAGE), M_PIERRE, racine)
boite('Aile_Toit', (demi_l - AILE_LARGEUR / 2, demi_p + AILE_PROF / 2, H_ETAGE + 0.15),
      (AILE_LARGEUR + DEBORD_TOIT, AILE_PROF + DEBORD_TOIT, 0.3), M_TOIT, racine)

# Terrasse dans la cour arrière
boite('Terrasse', (-2.0, demi_p + 3.0, 0.06), (8.0, 6.0, 0.12), M_PLANCHER, racine)


# ── Éclairage ──────────────────────────────────────────────────────────────
# Un soleil bas et chaud : c'est lui qui donne le caractère. Les lumières
# d'appoint restent faibles — on cherche du contraste, pas de l'uniformité.
bpy.ops.object.light_add(type='SUN', location=(18, -22, 16))
soleil = bpy.context.active_object
soleil.name = 'Soleil'
soleil.data.energy = 3.2
soleil.data.angle = math.radians(1.5)
soleil.data.color = (1.0, 0.92, 0.80)
soleil.rotation_euler = (math.radians(58), 0, math.radians(38))

for nom, pos in (('App_Salon', (-4, -2, H_ETAGE - 0.4)),
                 ('App_Cuisine', (0, 3, H_ETAGE - 0.4)),
                 ('App_Etage', (0, -1, H_ETAGE * 2 - 0.4))):
    bpy.ops.object.light_add(type='AREA', location=pos)
    a = bpy.context.active_object
    a.name = nom
    a.data.energy = 60
    a.data.size = 2.5
    a.data.color = (1.0, 0.88, 0.72)

# Ciel
monde = bpy.context.scene.world
monde.use_nodes = True
monde.node_tree.nodes['Background'].inputs['Color'].default_value = (0.30, 0.38, 0.50, 1)
monde.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.9


# ── Caméra et parcours ─────────────────────────────────────────────────────
# Neuf étapes, une par section du site. Chaque marqueur porte la position de
# la caméra et son point de visée : c'est ce couple qui sera rendu.
ETAPES = [
    ('00_exterieur',  (0,  -26, 6.0),   (0,   0, 3.0)),
    ('01_entree',     (2.6, -3.5, 1.6), (2.6, 2.0, 1.5)),
    ('02_salon',      (-1.0, -2.0, 1.6),(-5.0, 1.0, 1.4)),
    ('03_cuisine',    (-1.0, 1.8, 1.6), (-4.5, 4.5, 1.3)),
    ('04_bain',       (4.2, 2.0, 1.6),  (5.6, 4.6, 1.3)),
    ('05_chambre',    (-2.0, -3.6, H_ETAGE + 1.6), (-4.5, -0.5, H_ETAGE + 1.4)),
    ('06_bureau',     (3.0, 1.2, H_ETAGE + 1.6),   (5.5, 4.0, H_ETAGE + 1.4)),
    ('07_cour',       (-2.0, 12.0, 2.2),(-1.0, 4.0, 2.0)),
    ('08_aerien',     (0, 4, 34),       (0,  2, 0)),
]

bpy.ops.object.camera_add(location=(0, -26, 6))
cam = bpy.context.active_object
cam.name = 'Camera_Parcours'
cam.data.lens = 24          # grand angle : indispensable en intérieur
cam.data.clip_start = 0.05
bpy.context.scene.camera = cam

# Cible que la caméra suit : plus simple à animer qu'une rotation directe.
cible = bpy.data.objects.new('Camera_Cible', None)
bpy.context.collection.objects.link(cible)
cible.empty_display_size = 0.3
c = cam.constraints.new('TRACK_TO')
c.target = cible
c.track_axis = 'TRACK_NEGATIVE_Z'
c.up_axis = 'UP_Y'

# Une image par étape : on rend ensuite chaque image séparément.
scene = bpy.context.scene
scene.frame_start = 1
scene.frame_end = len(ETAPES)

for i, (nom, pos, vise) in enumerate(ETAPES, start=1):
    scene.frame_set(i)
    cam.location = pos
    cam.keyframe_insert('location', frame=i)
    cible.location = vise
    cible.keyframe_insert('location', frame=i)
    marqueur = scene.timeline_markers.new(nom, frame=i)

def fcurves_de(action):
    """
    Récupère les courbes d'animation, quelle que soit la version de Blender.

    Depuis Blender 4.4 les actions sont « à emplacements » : les courbes sont
    rangées dans action.layers[].strips[].channelbags[].fcurves et l'ancien
    raccourci action.fcurves a disparu. Sans ce repli, le script plante sur
    Blender 5.
    """
    if hasattr(action, 'fcurves'):
        return list(action.fcurves)
    courbes = []
    for couche in getattr(action, 'layers', []):
        for strip in getattr(couche, 'strips', []):
            for bag in getattr(strip, 'channelbags', []):
                courbes.extend(bag.fcurves)
    return courbes


# Interpolation en escalier : chaque image est une vue fixe, pas un travelling.
for obj in (cam, cible):
    if obj.animation_data and obj.animation_data.action:
        for fcu in fcurves_de(obj.animation_data.action):
            for kp in fcu.keyframe_points:
                kp.interpolation = 'CONSTANT'

# Rendu
scene.render.engine = 'CYCLES'
scene.cycles.samples = 128
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.film_transparent = False
scene.frame_set(1)

print('Spécimen 02 — maison construite.')
print(f'{len(ETAPES)} étapes de caméra. Images 1 à {len(ETAPES)}.')
print('Rendu : Render → Render Animation (une image par étape).')
