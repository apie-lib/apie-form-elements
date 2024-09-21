import { Component, Host, h, Prop, State } from '@stencil/core';
import { FileData, toFileList } from '../../utils/utils';

function renderHiddenField(data: {name:string, value: string|File}) {
  if (data.value instanceof File) {
    return <input name={data.name} type="file" class="hidden-field" files={toFileList(data.value)} />
  }
  if (data.value.indexOf("\n") > -1) {
    return <textarea readonly class="hidden-field" name={data.name}>{data.value}</textarea>
  }
  return <input type="hidden" name={data.name} value={data.value} />
}

@Component({
  tag: 'apie-render-types',
  styleUrl: 'apie-render-types.css',
  shadow: false,
  scoped: true,
})
export class ApieRenderTypes {
  @Prop({ reflect: true }) value: Record<string, any> = {};

  @Prop({reflect: true}) csrfToken: string|null = null;

  @Prop({ reflect: true, mutable: true }) internalState: Record<string, any> = {};

  @Prop({reflect: true }) supportsMultipart: boolean = false;

  @State() private storedMappedFiles: WeakMap<File, FileData> = new WeakMap();

  // workaround for loading the file in memory if supportsMultipart = false
  @State() private date: Date = new Date()

  public getHiddenFields(): Array<{name:string, value: string}> {
    const res = [];
    const todoList: Array<[any, string]> = [[this.value, '_apie']];
    let todo;
    while (todo = todoList.pop()) {
      if (todo[0] === null || todo[0] === undefined) {
        res.push({name: todo[1], value: 'null'});
        continue;
      }
      if (todo[0] instanceof File) {
        res.push({name: todo[1], value: 'Psr\\Http\\Message\\UploadedFileInterface'});
        continue;
      }
      if (Array.isArray(todo[0])) {
        if (todo[0].length === 0) {
          res.push({name: todo[1], value: 'array'});
        }
        todoList.push(...todo[0].map((value: any, index: number): [any, string] => {
          return [value, todo[1] + '[' + index + ']'];
        }));
        continue;
      }
      switch (typeof todo[0]) {
        case 'boolean':
          res.push({name: todo[1], value: todo[0] ? 'true': 'false'});
          continue;
        case 'number':
        case 'string':
        case 'bigint':
          continue;
      }
      const entries = Object.entries(todo[0]);
      todoList.push(...entries.map((subEntry): [any, string] => {
        return [subEntry[1], todo[1] + '[' + subEntry[0] + ']'];
      }));
      if (entries.length === 0) {
        res.push({name: todo[1], value: 'object'});
      }
    }
    return res;
  }

  public getInternalFields(): Array<{name:string, value: string}> {
    const res = [];
    const todoList: Array<[any, string]> = [[this.internalState, '_internal']];
    let todo: [any, string];
    while (todo = todoList.pop()) {
      if (todo[0] === null || todo[0] === undefined) {
        continue;
      }
      if (Array.isArray(todo[0])) {
        todoList.push(...todo[0].map((value: any, index: number): [any, string] => {
          return [value, todo[1] + '[' + index + ']'];
        }))
        continue;
      }
      switch (typeof todo[0]) {
        case 'boolean':
          continue;
        case 'string':
          if (todo[0] !== '') {
            res.push({name: todo[1], value: String(todo[0])});
          }
          continue;
        case 'number':
        case 'bigint':
          res.push({name: todo[1], value: String(todo[0])});
          continue;
      }
      const entries = Object.entries(todo[0]);
      todoList.push(...entries.map((subEntry): [any, string] => {
        return [subEntry[1], todo[1] + '[' + subEntry[0] + ']'];
      }));
    }
    return res;
  }

  public getSubmitFields(): Array<{name:string, value: string}> {
    const res = [];
    const todoList: Array<[any, string]> = [[this.value, 'form']];
    let todo: [any, string];
    while (todo = todoList.pop()) {
      if (todo[0] === null || todo[0] === undefined) {
        continue;
      }
      if (todo[0] instanceof File) {
        if (this.supportsMultipart) {
          res.push({name: todo[1], value: todo[0]});
        } else {
          if (this.storedMappedFiles.has(todo[0])) {
            todo[0] = this.storedMappedFiles.get(todo[0]);
          } else {
            const file: File = todo[0];
            const reader = new FileReader();
            reader.addEventListener(
              "load",
              () => {
                // convert image file to base64 string
                this.storedMappedFiles.set(file, {
                  base64: String(reader.result).replace(/^data:[^;]+;base64,/, ''),
                  originalFilename: file.name
                })
                setTimeout(() => {
                  this.date = new Date()
                }, 0)
              },
              false,
            );
            reader.readAsDataURL(file);
          }
        }
      }
      if (Array.isArray(todo[0])) {
        todoList.push(...todo[0].map((value: any, index: number): [any, string] => {
          return [value, todo[1] + '[' + index + ']'];
        }));
        continue;
      }
      switch (typeof todo[0]) {
        case 'boolean':
          continue;
        case 'number':
        case 'string':
        case 'bigint':
          res.push({name: todo[1], value: String(todo[0])});
          continue;
      }
      const entries = Object.entries(todo[0]);
      todoList.push(...entries.map((subEntry): [any, string] => {
        return [subEntry[1], todo[1] + '[' + subEntry[0] + ']'];
      }));
    }
    return res;
  }

  render() {
    return (
      <Host id={'a' + String(this.date).replace(/[\s\+\-\(\):]/g, '')}>
        { this.csrfToken && <input type="hidden" name="_csrf" value={this.csrfToken} /> }
        { this.getInternalFields().map(renderHiddenField)}
        { this.getSubmitFields().map(renderHiddenField)}
        { this.getHiddenFields().map(renderHiddenField)}
      </Host>
    );
  }

}
