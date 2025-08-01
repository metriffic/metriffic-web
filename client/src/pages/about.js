import React, { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { base16AteliersulphurpoolLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactGA from "react-ga4";
import "./about.css";


const CollapsibleItem = ({ title, content, code_type }) => {
    const [is_expanded, set_is_expanded] = useState(false);
    const bla = base16AteliersulphurpoolLight;
    bla.fontSize = 11;
    return (
        <div className="code-section">
        <div
            className="clickable-item"
            onClick={() => set_is_expanded(!is_expanded)}>
            {title}
            {/* {is_expanded
                ? `collapse ${title}`
                : `expand ${title}`} */}
        </div>
        {is_expanded && (
        <SyntaxHighlighter language={code_type} style={bla} >
                 {content}
        </SyntaxHighlighter>)}
        </div>
    )
};

const ImageGallery = () => {
    const [selectedImage, setSelectedImage] = useState(null);
  
    const styles = {
        thumbnailContainer: {
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem'
        },
        thumbnail: {
          width: '150px',
          objectFit: 'cover',
          cursor: 'pointer',
          borderRadius: '0.25rem'
        },
        modalOverlay: {
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        },
        modal: {
          maxWidth: '50vw',
          maxHeight: '70vh',
          objectFit: 'contain'
        }
      };
    
  
    const images = [
        { src: "/server/mf.1.jpg", alt: "server #1" },
        { src: "/server/mf.2.jpg", alt: "server #2" },
        { src: "/server/mf.3.jpg", alt: "server #3" }
    ];
  
    const on_image_click = (image) => {
      setSelectedImage(image);
    };
  
    const on_modal_click = () => {
      setSelectedImage(null);
    };
  
    return (
        <div className="image-gallery">
          <div style={styles.thumbnailContainer}>
            {images.map((image, index) => (
              <img
                key={index}
                src={image.src}
                alt={image.alt}
                style={styles.thumbnail}
                onClick={() => on_image_click(image)}
              />
            ))}
          </div>
    
          {selectedImage && (
            <div 
              style={styles.modalOverlay}
              onClick={on_modal_click}
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                style={styles.modal}
              />
            </div>
          )}
        </div>
      );
};


const AboutPage = () => {
  const [expanded_sections, set_expanded_sections] = useState({});

    useEffect(() => {
        ReactGA.initialize("G-0BB9RR5QRK");
        ReactGA.send({ hitType: "pageview", page: "/about", title: "about" });  
    }, []);

    const toggle_section = (section) => {
        set_expanded_sections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };


  const interactive_cmd_help = `interactive <command>: mandatory argument, session request to execute. Can be either
        'start', 'stop', 'join', ''status' or 'save'.
   -p|--platform <platform name>: name of the platform to start mission on.
   -d|--docker-image <docker image>: docker image to instantiate on the target board.
   -c|--comment <text>: description of the requested operation.
   -n|--name <name of the session>: Name of the session to perform operation on.`

const show_cmd_help = `show <items>: mandatory argument, the type of data to show. Can be either 'platforms',
        'sessions' or 'docker-images'.
   -p|--platform <platform name>: platform selector, can be used when querying docker-images
   -f|--filter <status>: Used for sessions, format: {state:SUBMITTED|RUNNING|CANCELED|COMPLETED}.`

const workspace_cmd_help = `workspace <command>: mandatory argument, workspace command to execute. Can be either
        'sync', 'set' or 'show'.
   <direction>: mandatory for 'sync' command, the direction of file synchronization.
        Can be either 'up' or 'down'.
   -f|--folder <folder name>: can be used with
          'sync' (relative path of a subfolder to synchronize), or with
          'set'  (specifying new folder for the workspace)'.
   -d|--delete: used with 'sync', enables deletion of extraneous files from the receiving side.`

const batch_cmd_help = `batch <command>: mandatory argument, session request to execute. Can be either
        'start', 'stop' or 'status'.
   -p|--platform <platform name>: name of the platform to start mission on.
   -d|--docker-image <docker image>: docker image to instantiate on the target board.
   -r|--run-script <script/binary>: the script or binary command to execute,
        mandatory for batch mode.
   -s|--dataset-split <n=1>: split the dataset into this many chunks, one chunk per job.
   -j|--jobs <n=1>: maximum number of simultaneous jobs.
   -n|--name <name of the session>: Name of the session to perform operation on.`

const cli_build_shell_script = `# install the required packages (ubuntu 22.04+)
sudo apt update
sudo apt install build-essential vim git cmake libboost-system-dev libboost-chrono-dev \\
            libboost-thread-dev libboost-filesystem-dev libssh2-1-dev openssl
# clone the repo
git clone https://github.com/metriffic/metriffic-cli.git
# and build it...
cd metriffic-cli
git submodule update --init --recursive
mkdir build; cd build
cmake ..
make`

const batch_shell_script = `#!/bin/bash
 session_dir="/workspace/session.$1"
 mkdir -p "$session_dir"
 python3 /workspace/run_imgnetdet.py --output-dir $session_dir --dataset-chunk $2 >& $session_dir/batch.$2.out`

const batch_python_script = `import os
import time
import cv2
import json
import argparse
import numpy as np
from collections import defaultdict
from pycocotools.coco import COCO
from pycocotools.cocoeval import COCOeval
import tensorflow as tf

# Paths
MODEL_PATH = "/public/MobileNetSSD/detect.tflite"
COCO_ANNOTATIONS_PATH = "/public/instances_val2017.json"
IMAGES_DIR = "/public/val2017"

# Parameters
IMAGE_SIZE = (300, 300)  # Input size for MobileNet SSD
IOU_TYPE = "bbox"  # Evaluation type
CONFIDENCE_THRESHOLD = 0.5  # Minimum confidence for detections
N = 10  # Number of images to process

class DetectionEvaluator:
    def __init__(self, coco_gt, iou_threshold=0.5):
        self.coco_gt = coco_gt
        self.iou_threshold = iou_threshold
        self.categories = coco_gt.cats
        self.results = {
            'per_category': defaultdict(lambda: {'true_positives': 0, 'false_positives': 0, 'false_negatives': 0}),
            'timing': []
        }

    def update_timing(self, image_id, preprocessing_time, inference_wallclock_time,
                     inference_cpu_user_time, inference_cpu_system_time):
        """Store timing information for each image"""
        self.results['timing'].append({
            'image_id': image_id,
            'preprocessing_time': preprocessing_time,
            'inference_wallclock_time': inference_wallclock_time,
            'inference_cpu_user_time': inference_cpu_user_time,
            'inference_cpu_system_time': inference_cpu_system_time
        })

    def compute_metrics(self):
        """Compute precision, recall, and F1 score for each category and overall"""
        metrics = {}
        total_tp = 0
        total_fp = 0
        total_fn = 0

        # Per-category metrics
        for category_id, values in self.results['per_category'].items():
            tp = values['true_positives']
            fp = values['false_positives']
            fn = values['false_negatives']

            precision = tp / (tp + fp) if (tp + fp) > 0 else 0
            recall = tp / (tp + fn) if (tp + fn) > 0 else 0
            f1_score = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0

            metrics[category_id] = {
                'precision': precision,
                'recall': recall,
                'f1_score': f1_score
            }

            total_tp += tp
            total_fp += fp
            total_fn += fn

        # Overall metrics
        overall_precision = total_tp / (total_tp + total_fp) if (total_tp + total_fp) > 0 else 0
        overall_recall = total_tp / (total_tp + total_fn) if (total_tp + total_fn) > 0 else 0
        overall_f1 = 2 * (overall_precision * overall_recall) / (overall_precision + overall_recall) if (overall_precision + overall_recall) > 0 else 0

        metrics['overall'] = {
            'precision': overall_precision,
            'recall': overall_recall,
            'f1_score': overall_f1
        }

        # Timing statistics
        if self.results['timing']:
            timing_stats = {
                'preprocessing_time': {
                    'mean': np.mean([t['preprocessing_time'] for t in self.results['timing']]),
                    'std': np.std([t['preprocessing_time'] for t in self.results['timing']])
                },
                'inference_wallclock_time': {
                    'mean': np.mean([t['inference_wallclock_time'] for t in self.results['timing']]),
                    'std': np.std([t['inference_wallclock_time'] for t in self.results['timing']])
                },
                'inference_cpu_user_time': {
                    'mean': np.mean([t['inference_cpu_user_time'] for t in self.results['timing']]),
                    'std': np.std([t['inference_cpu_user_time'] for t in self.results['timing']])
                },
                'inference_cpu_system_time': {
                    'mean': np.mean([t['inference_cpu_system_time'] for t in self.results['timing']]),
                    'std': np.std([t['inference_cpu_system_time'] for t in self.results['timing']])
                }
            }
            metrics['timing'] = timing_stats

        return metrics

def load_model(model_path):
    interpreter = tf.lite.Interpreter(model_path=model_path)
    interpreter.allocate_tensors()
    return interpreter

def preprocess_image(image_path, target_size):
    img = cv2.imread(image_path)
    image_shape = img.shape[:2]  # (height, width)
    img_resized = cv2.resize(img, target_size)
    input_data = np.expand_dims(img_resized, axis=0).astype(np.uint8)
    return img, input_data

def postprocess_detections(output_data, image_shape, threshold=0.5):
    height, width = image_shape
    boxes = output_data[0][0]  # Bounding boxes (normalized coordinates)
    scores = output_data[2][0]  # Detection confidence scores
    classes = output_data[1][0].astype(int)  # Class IDs (converted to integers)
    num_detections = int(output_data[3][0])  # Number of valid detections

    detections = []
    for i in range(num_detections):
        score = scores[i]
        if score >= threshold:
            ymin, xmin, ymax, xmax = boxes[i]
            bbox = [
                xmin * width,  # x
                ymin * height,  # y
                (xmax - xmin) * width,  # width
                (ymax - ymin) * height,  # height
            ]
            detections.append({
                "bbox": bbox,
                "score": float(score),
                "class_id": classes[i],
                "category_id": classes[i] + 1,  # Adjust for COCO categories
            })
    return detections

def save_detections(image, detections, original_name, output_folder="output"):
    img = image.copy()
    for det in detections:
        bbox = det["bbox"]
        score = det["score"]
        class_id = det["category_id"]

        x, y, w, h = [int(v) for v in bbox]
        cv2.rectangle(img, (x, y), (x + w, y + h), (255, 0, 0), 2)
        label = f"Class {class_id} | {score:.2f}"
        cv2.putText(img, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)

    base_name, ext = os.path.splitext(original_name)
    output_name = f"{base_name}.detected{ext}"
    output_path = os.path.join(output_folder, output_name)
    cv2.imwrite(output_path, img)
    return output_path

def main(output_dir, dataset_chunk):

    #output_dir = f"/workspace/bench_results"
    #os.makedirs(output_dir, exist_ok=True)
    results = []

    # Initialize COCO ground truth and evaluator
    coco = COCO(COCO_ANNOTATIONS_PATH)
    evaluator = DetectionEvaluator(coco)

    interpreter = load_model(MODEL_PATH)
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()

    image_ids = coco.getImgIds()[N*dataset_chunk:N*(dataset_chunk+1)]
    for image_id in image_ids:
        img_info = coco.loadImgs(image_id)[0]
        image_path = os.path.join(IMAGES_DIR, img_info["file_name"])

        # Timing for preprocessing
        start_preprocessing = time.perf_counter()
        img, input_data = preprocess_image(image_path, IMAGE_SIZE)
        end_preprocessing = time.perf_counter()
        preprocessing_time = end_preprocessing - start_preprocessing

        # Timing for inference
        start_inference_wallclock = time.time()
        start_inference_cpu = os.times()
        interpreter.set_tensor(input_details[0]["index"], input_data)
        interpreter.invoke()
        end_inference_cpu = os.times()
        end_inference_wallclock = time.time()

        inference_wallclock_time = end_inference_wallclock - start_inference_wallclock
        inference_cpu_user_time = end_inference_cpu.user - start_inference_cpu.user
        inference_cpu_system_time = end_inference_cpu.system - start_inference_cpu.system

        # Update timing statistics
        evaluator.update_timing(
            image_id,
            preprocessing_time,
            inference_wallclock_time,
            inference_cpu_user_time,
            inference_cpu_system_time
        )

        print(f"TIMING image: [{image_id}] preprocessing: [{preprocessing_time}], inference_wc: [{inference_wallclock_time}], " +
              f"inference_cpu_user: [{inference_cpu_user_time}], inference_cpu_sys: [{inference_cpu_system_time}]")

        # Get model outputs and process detections
        output_data = [
            interpreter.get_tensor(output_details[i]["index"])
            for i in range(len(output_details))
        ]

        detections = postprocess_detections(
            output_data,
            image_shape=img.shape[:2],
            threshold=CONFIDENCE_THRESHOLD
        )

        # Save detections for COCO evaluation
        for det in detections:
            results.append({
                "image_id": int(image_id),
                "category_id": int(det["category_id"]),
                "bbox": [float(coord) for coord in det["bbox"]],
                "score": float(det["score"])
            })

        # Save visualization
        save_detections(img, detections, img_info["file_name"], output_dir)

    # Save results to file
    results_file = os.path.join(output_dir, "detections.json")
    with open(results_file, "w") as f:
        json.dump(results, f)

    # Perform COCO evaluation
    print(f"\nPerforming COCO evaluation on {N} images...")
    coco_dets = coco.loadRes(results_file)
    coco_eval = COCOeval(coco, coco_dets, iouType=IOU_TYPE)
    coco_eval.params.imgIds = image_ids  # Evaluate only on processed images
    coco_eval.evaluate()
    coco_eval.accumulate()
    coco_eval.summarize()

    # Calculate additional metrics
    metrics = evaluator.compute_metrics()

    # Save detailed metrics to file
    metrics_file = os.path.join(output_dir, "metrics.json")
    with open(metrics_file, "w") as f:
        json.dump(metrics, f, indent=2)

    # Print timing statistics
    print("\nTiming Statistics:")
    timing_stats = metrics['timing']
    print(f"Preprocessing time: {timing_stats['preprocessing_time']['mean']:.4f} +/- {timing_stats['preprocessing_time']['std']:.4f} s")
    print(f"Inference wallclock time: {timing_stats['inference_wallclock_time']['mean']:.4f} +/- {timing_stats['inference_wallclock_time']['std']:.4f} s")
    print(f"Inference CPU user time: {timing_stats['inference_cpu_user_time']['mean']:.4f} +/- {timing_stats['inference_cpu_user_time']['std']:.4f} s")
    print(f"Inference CPU system time: {timing_stats['inference_cpu_system_time']['mean']:.4f} +/- {timing_stats['inference_cpu_system_time']['std']:.4f} s")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Print the provided dataset chunk number.")
    parser.add_argument('--output-dir', type=str, required=True)
    parser.add_argument('--dataset-chunk', type=int, required=True)
    args = parser.parse_args()
    print(f"The dataset chunk number is: {args.dataset_chunk}")
    main(args.output_dir, args.dataset_chunk)
`
// refined
const video_exp_batch = `1. The user logs into the system and prints the workspace path.
2. Switches to the workspace, showing the shell script (to be passed to the command)
   and the Python script (which runs the batch job). The shell script demonstrates
   the input arguments provided by the system, and the Python script shows how those
   arguments are used.
3. Calls 'workspace sync up' to upload the scripts to the system workspace.
   Note: 'workspace' command is covered in section 4.4.
4. Displays the help information for the batch command, then runs the command.
   Batch jobs are used for running parallel jobs on the grid. This is done by
   splitting the input dataset into chunks and feeding each chunk to a separate
   job. The command has two important arguments that control execution:
      -d|--dataset-split: speficies how many chunks should the dataset be split into
      -j|--max-jobs: specifies the max number of containers that can be run on the
                     the grid simultaneously processing those chunks. This is the
                     max cap, the actual number of parallel jobs of course depends
                     on priority and grid utiliziation...
   When called, the command creates all these jobs and submits them to the scheduler.
   The session is complete when all jobs are done, or when it's canceled (by calling
   'batch stop' command)
5. The user monitors the session status until it is marked COMPLETED.
6. Finally, calls 'workspace sync down' to download the batch run artifacts into the
   local workspace. Then lists the downloaded session folder and shows the contents of
   output files.`


// refined
const video_exp_interactive_start = `1. The user begins by displaying the help menu for the interactive command.
2. Initiates a session on an RPi4 machine using the standard Docker image 'rpi4-basic'.
   This command performs the following actions:
     - reserves a board of the specified type.
     - launches a Docker container on the reserved board, injects the user's public
       key into the container's '/root/.ssh/authorized_keys' file, and starts an SSH
       server.
     - locates an available port on the user's machine and establishes an SSH tunnel
       through 'metriffic.com:2222' using it as a bastion, authenticated by the
       registered bastion public key.
     - outputs the SSH command needed to connect to the running Docker container via
       the Metriffic bastion.
3. Opens a new terminal tab and connects to the container via SSH.
4. Execute a few binaries to display platform information.
5. Following the same steps, the user starts another interactive session, this time
   on a Jetson Nano board.
6. Finally, the user runs the 'show sessions' command to display the status of both
   active sessions.`
// refined
const video_exp_interactive_save = `1. The user runs 'show sessions' to display the active RPi4 session, then
   switches to the terminal tab where they have an SSH connection to that container.
2. Confirms that vim is not installed inside the container and proceeds to install it.
3. Returning to the CLI tool, the user runs 'interactive save' and names the new Docker
   image rpi4-basic-vim.
4. Once the operation is complete, the user calls 'show docker-images' to verify that the
   newly created image is listed and available.`
// refined
const video_exp_interactive_join = `1. The user launches the CLI tool and logs in.
2. The user then runs 'show sessions' to display information about the two running
   interactive sessions: one on an RPi4 and another on a Jetson Nano.
3. Calls 'interactive join' to open a tunnel to the Docker container on the RPi4 board,
   then opens a new terminal tab and connects via SSH.
   The same steps are repeated for the Jetson Nano session.
4. Finally, the user stops both sessions, showing that the connections have been
   terminated, and confirms by running sessions show again to verify both sessions
   are closed.`
// refine
const video_exp_workspace = `1. The user calls workspace show to display the local workspace currently set
   for the logged-in user.
2. Opens a new terminal tab, switches to the local workspace, and creates an empty file
   named 'local_file'.
3. Calls 'workspace sync up' to upload the local file to the user's workspace managed
   by the service.
4. Switches to two other terminal tabs with SSH sessions connected to active containers:
   one on an RPi4 board and another on a Jetson Nano.
   Both containers show local_file in their /workspace mount.
5. The user then creates two additional empty files: '/workspace/rpi4_file' in the RPi4
   container and '/workspace/jnano_file' in the Jetson Nano container.
6. Verifies that all files are visible in the /workspace mount on both containers.
7. Finally, the user runs 'workspace sync down' in the Metriffic CLI to synchronize the
   local workspace with the system workspace. Lists the local directory to confirm that
   all files have been successfully transferred.`

  return (
    <div className="about-container">
      <aside className="toc">
        <h4 className="toc-title">Metriffic</h4>
        <ul className="nav-links">
          <li>
            <li><a href="#section_introduction">Introduction</a></li>
            <ul className="sub-links">
                <li><a href="#subsection_about_the_service">About the Service</a></li>
                <li><a href="#subsection_supported_functionality">Supported Functionality</a></li>
            </ul>
            <li><a href="#section_under_the_hood">Under the Hood</a></li>
            <ul className="sub-links">
                <li><a href="#subsection_system_design">System Design</a></li>
                <li><a href="#subsection_source_code">Source Code</a></li>
                <li><a href="#subsection_build_cli">Building the CLI tool</a></li>
            </ul>


            <li><a href="#section_registration">User Registration</a></li>
            {/*<li><a href="#section_howdoesthiswork">How doest this work?</a></li> */}

            {/* <div className="parent-item" onClick={() => toggle_section("section_cli_commands")}>
              <span>4. CLI Commands</span>
              <span className={`arrow ${expanded_sections["section_cli_commands"] ? "expanded" : ""}`}>&#9662;</span>
            </div> */}
            <li><a href="#section_cli_commands">CLI Commands</a></li>
            {(true || expanded_sections["section_cli_commands"]) && (
              <ul className="sub-links">
                <li><a href="#subsection_show_commands"><b><u>show</u></b></a></li>
                <li><a href="#subsection_interactive_commands"><b><u>interactive</u></b></a></li>
                <li><a href="#subsection_batch_commands"><b><u>batch</u></b></a></li>
                <li><a href="#subsection_workspace_commands"><b><u>workspace</u></b></a></li>
              </ul>
            )}
          </li>

          <li><a href="#section_knownissues">Known Issues and Limitations</a></li>
          <li><a href="#section_nextsteps">Planned Features</a></li>
        </ul>
      </aside>






      <main className="main-content">
        <section className="content">
        <h4 style={{color:'red', fontWeight:600}}>this page is work-in-progress</h4>
            <h4 id="section_introduction">Introduction </h4>
                <h6 id="subsection_about_the_service">About the Service</h6>
                <p>
                     Metriffic is an automation tool designed to assist software development for System on 
                     Module (SoM) platforms - the kind you'll find in consumer and commercial robotics, smart
                     devices and similar projects. Taking inspiration from Sun Grid Engine (SGE), it applies
                     similar task scheduling and resource management principles, but specifically tailored
                     for SoM environments.
                </p>
                <p>
                     The service simplifies platform access for both testing and performance analysis. You can validate your 
                     applications and ML models using prerecorded datasets, run benchmarks, and conduct optimization experiments. 
                     It's a practical tool that can help developers in tuning their application and finding the right tradeoff 
                     between computational performance, power consumption and cost. 
                </p>
                <p>
                    I started this as a side project during COVID and so the currently supported platforms are a bit dated:
                        <b className='bold-line'>Jetson Nano</b>
                        <b className='bold-line'>Google Coral Devboard</b>
                        <b className='bold-line'>Raspberry Pi4</b>
                        <b className='bold-line'>Raspberry Pi3</b>
                        <div style={{marginBottom:10}}></div>
                    However, adding support for new platforms and extending the grids is straightforward — I’m happy to do so 
                    if there’s interest. <br/> 
                    Everything, including this website, runs off a small server in my garage (photos below). 
                </p>
                <ImageGallery/>
                <p>
                    That works fine for now, but if I add too many boards, bandwidth might not keep up, and I’ll have to consider 
                    moving it to a colocation center.<br/>
                    At this stage, most of the core features are in place and reasonably well-tested. Want to try it out? Drop 
                    me a message through the main page—I’d love to share access and hear your thoughts!
                </p>

            <div className='subsection-break'></div>

                <h6 id="subsection_supported_functionality">Supported Functionality</h6>
                <p>
                The service supports three main types of operations:
                </p>
                <ul style={{listStyleType:'circle'}}>
                    <li><b>Query</b>: display available resources (e.g., platforms, Docker images) and query sessions or jobs.</li>
                    <li><b>Session</b>:  start batch-mode or interactive sessions, stop active sessions, and check session status. </li>
                    <li><b>Workspace</b>: synchronize your local workspace with the remote one, and manage the local workspace 
                    path (show or set).</li>
                </ul>
                <p style={{marginBottom:10}}>
                And it's built on these core principles:  
                </p>              
                <ul style={{listStyleType:'circle'}}>
                    <li><b>Containerization</b>: all processing (batch tasks or live SSH sessions) runs in Docker containers, ensuring
                        a controlled and reproducible environment.</li>
                    <li><b>Single-container restriction</b>: each SoM/board runs only one container at a time, guaranteeing full resource 
                        access for accurate benchmarking and comparisons.</li>
                    <li><b>Volume mounts</b>: each running container has two fixed mounts:
                        <ul style={{listStyleType:'square'}}>
                            <li><b>/workspace</b>: A private read/write userspace for scripts, models, datasets, and other resources.</li>
                            <li><b>/public</b>: A public, read-only space containing shared resources like publicly available machine learning 
                            models, datasets, evaluation scripts, and similar data accessible to all users.</li>
                        </ul>
                    </li>    
                </ul>
                

            <div className='subsection-break'></div>

            <h4 id="section_under_the_hood">Under the Hood</h4>
                <h6 id="subsection_system_design">System Design</h6>
                    <p>
                    Here's a diagram showing all the  different parts of the system and how they work together
                    and interact with each other.
                    </p>
                    <img style={{display:'block', margin:'0px auto 20px auto', width:650}} src='system_design.svg'></img>
                    <p className='stripped-p'>On the left are our two user interfaces:</p>
                        <ul>
                            <li>The CLI tool handles most interactions with the service, allowing users to submit and cancel jobs, check their status, and exchange data.</li>
                            <li>The web service currently provides profile configuration functionality.</li>
                        </ul>
                    <p className='stripped-p'>On the right are the metriffic cloud microservices and components.</p>
                        <p className='stripped-p' style={{fontWeight:'bold',color:'red'}}>TBD: describe these components</p>

                <div className='subsection-break'></div>

                <h6 id="subsection_source_code">Source Code</h6>
                    <p className='stripped-p'>
                        Metriffic is open-source. <br/>
                        The cloud-side code is implemented in JS/node and is available in these repositories:
                        <a className='url-line' href='https://github.com/metriffic/metriffic-backend'>https://github.com/metriffic/metriffic-backend</a>
                        <a className='url-line' href='https://github.com/metriffic/metriffic-grid-service'>https://github.com/metriffic/metriffic-grid-service</a>
                        <a className='url-line' href='https://github.com/metriffic/metriffic-workspaces'>https://github.com/metriffic/metriffic-workspaces</a>
                        <a className='url-line' href='https://github.com/metriffic/metriffic-web'>https://github.com/metriffic/metriffic-web</a>
                        This repository contains some of the configuration scripts and docker files that can help with server setup:
                        <a className='url-line' href='https://github.com/metriffic/metriffic-cm.git'>https://github.com/metriffic/metriffic-cm.git</a>
                        But it's only partially automated and still requires several manual steps. Feel free to contact me if you're interested in trying it out—I'm happy to help!
                    </p>
                    <p style={{marginTop:10}}>The command-line-tool is in C++ and is available here:
                        <a className='url-line' href='https://github.com/metriffic/metriffic-cli.git'>https://github.com/metriffic/metriffic-cli.git</a>
                       The section below describes how it can be built.
                    </p>
                    {/* <p className='stripped-p' style={{fontWeight:'bold',color:'red'}}>TBD: describe</p> */}

                <div className='subsection-break'></div>

                <h6 id="subsection_build_cli">Building the CLI Tool</h6>
                    <p className='stripped-p'>
                        Command-line-tool (metriffic) is a C++ application that requires compilation. To build it
                        for ubuntu you need to follow the these steps.
                    </p>
                    <CollapsibleItem title='build instructions' content={cli_build_shell_script} code_type='bash'/>
                    <p>
                        (planning to share the homebrew recipe soon...)
                    </p>

            <div className='subsection-break'></div>

            <h4 id="section_registration">User Registration</h4>
                <p>
                    User registration is a two-step process. First, an account must be created on the server side by service admins.
                    <br/>
                    In the second step, the user generates two pairs of SSH keys and registers them in their user profile (the
                    purpose of having two key pairs is explained in a later section).
                    <br/>
                    <div style={{marginBottom:10}}></div>
                    Note that the service (at least the current implementation) is designed to not use passwords. Logging in to
                    the web-UI works through OTP emailed to the use. And all services that work via ssh-tunneling (i.e.
                    workspace rsync and ssh to interactive session container) work through ssh private/public keys.
                </p>
                <p className='stripped-p'>This video demonstrates how to do the second step.</p>
                <video className="w-full rounded-lg video-screencast" controls>
                    <source src="/screencaptures/mgen.adding_keys.mp4" type="video/mp4" />
                </video>

            <div className='subsection-break'></div>

            <h4 id="section_cli_commands">CLI Commands</h4>
                <h6 id="subsection_show_commands"><b><u>show</u></b></h6>
                    <p className='stripped-p'>Command options:</p>
                    <pre className="command-help">{show_cmd_help}</pre>
                    <p className='stripped-p' style={{marginTop:15}}>Here's how it works.</p>
                    <video className="w-full rounded-lg video-screencast" controls>
                        <source src="/screencaptures/mgen.show.mp4" type="video/mp4" />
                    </video>

                <div className='subsection-break'></div>

                <h6 id="subsection_interactive_commands"><b><u>interactive</u></b></h6>
                    <p className='stripped-p'>Command options:</p>
                    <pre className="command-help">{interactive_cmd_help}</pre>
                    <p className='stripped-p' style={{marginTop:15}}>This video demonstrates how this command can be used to start an interactive session and access the allocated machine.</p>
                    <video className="w-full rounded-lg video-screencast" controls>
                        <source src="/screencaptures/mgen.interactive_start.mp4" type="video/mp4" />
                    </video>
                    <CollapsibleItem title="what's going on here?"anded_sections content={video_exp_interactive_start} code_type='text'/>

                    <p className='stripped-p' style={{marginTop:15}}>This one shows how the docker container can be modified and then committed and saved/pushed as a new image.</p>
                    <video className="w-full rounded-lg video-screencast" controls>
                        <source src="/screencaptures/mgen.interactive_save.mp4" type="video/mp4" />
                    </video>
                    <CollapsibleItem title="what's going on here?"anded_sections content={video_exp_interactive_save} code_type='text'/>

                    <p className='stripped-p' style={{marginTop:15}}>And this one shows how to re-establish a tunnel/connection to a container of an active interactive session.</p>
                    <video className="w-full rounded-lg video-screencast" controls>
                        <source src="/screencaptures/mgen.interactive_join.mp4" type="video/mp4" />
                    </video>
                    <CollapsibleItem title="what's going on here?"anded_sections content={video_exp_interactive_join} code_type='text'/>

                <div className='subsection-break'></div>

                <h6 id="subsection_batch_commands"><b><u>batch</u></b></h6>
                    <p className='stripped-p'>Command options:</p>
                    <pre className="command-help">{batch_cmd_help}</pre>
                    <p className='stripped-p'>Demonstration of workspace commands.</p>
                    <video className="w-full rounded-lg video-screencast" controls>
                        <source src="/screencaptures/mgen.batch.mp4" type="video/mp4" />
                    </video>
                    <CollapsibleItem title="what's going on here?"anded_sections content={video_exp_batch} code_type='text'/>
                    <p className='stripped-p'>These are the scripts use in the demo:</p>
                    <CollapsibleItem title='batch shell script' content={batch_shell_script} code_type='bash'/>
                    <CollapsibleItem title='inference py script' content={batch_python_script} code_type='python'/>

                <div className='subsection-break'></div>

                <h6 id="subsection_workspace_commands"><b><u>workspace</u></b></h6>
                    <p className='stripped-p'>Command options:</p>
                    <pre className="command-help">{workspace_cmd_help}</pre>
                    <p className='stripped-p'>Demonstration of workspace commands.</p>
                    <video className="w-full rounded-lg video-screencast" controls>
                        <source src="/screencaptures/mgen.workspace.mp4" type="video/mp4" />
                    </video>
                <CollapsibleItem title="what's going on here?" content={video_exp_workspace} code_type='text'/>



            <h4 id="section_knownissues">Known issues and limitations</h4>
                <ul style={{listStyleType:'circle'}}>
                    <li>Endurance of microsd cards?</li>
                    <li>Interactive sessions get stuck pending when no resources immediately available.</li>
                    <li className='stripped-p' style={{fontWeight:'bold',color:'red'}}>tobeadded</li>
                </ul>

            <h4 id="section_nextsteps">Planned Features...</h4>
                <ul style={{listStyleType:'circle'}}>
                    <li>Users sharing docker images.</li>
                    <li>Emailing users about running interactive sessions, coming up with some kind of auto-termination policy.</li>
                    <li>Make cpu usage data available to the running container.</li>
                    <li>Use a current sensor per board, make power consumption data available to the running container.</li>
                    <li>Web-ui for managing jobs, checking the status, review of run results.</li>
                    <li className='stripped-p' style={{fontWeight:'bold',color:'red'}}>tobeadded</li>
                </ul>

        </section>
      </main>
    </div>
  );
};

export default AboutPage;
